import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import initSqlJs from 'sql.js';
import { DataSource, SchemaField } from '../types';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const parseFile = async (file: File): Promise<DataSource | null> => {
  const fileType = file.name.split('.').pop()?.toLowerCase();
  let data: any[] = [];
  
  try {
    switch (fileType) {
      case 'csv':
        data = await parseCSV(file);
        break;
      case 'xlsx':
      case 'xls':
        data = await parseExcel(file);
        break;
      case 'json':
        data = await parseJSON(file);
        break;
      case 'pdf':
        data = await parsePDF(file);
        break;
      case 'docx':
        data = await parseWord(file);
        break;
      case 'sql':
        data = await parseSQL(file);
        break;
      case 'txt':
        data = await parseTXT(file);
        break;
      default:
        console.error('Unsupported file type');
        return null;
    }

    const schema = inferSchema(data);
    
    return {
      id: crypto.randomUUID(),
      name: file.name,
      type: fileType as any,
      data,
      schema,
    };
  } catch (error) {
    console.error('Error parsing file:', error);
    return null;
  }
};

const parseCSV = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: (results) => resolve(results.data),
      header: true,
      error: reject,
    });
  });
};

const parseExcel = async (file: File): Promise<any[]> => {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(worksheet);
};

const parseJSON = async (file: File): Promise<any[]> => {
  const text = await file.text();
  return JSON.parse(text);
};

const parsePDF = async (file: File): Promise<any[]> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const textContent: any[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .map((item: any) => item.str)
      .join(' ');
    
    textContent.push({
      page: i,
      content: text,
    });
  }

  return textContent;
};

const parseWord = async (file: File): Promise<any[]> => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  const paragraphs = result.value.split('\n').filter(p => p.trim());
  
  return paragraphs.map((content, index) => ({
    paragraph: index + 1,
    content,
  }));
};

const parseSQL = async (file: File): Promise<any[]> => {
  const SQL = await initSqlJs();
  const arrayBuffer = await file.arrayBuffer();
  const db = new SQL.Database(new Uint8Array(arrayBuffer));
  const tables: any[] = [];

  // Get list of tables
  const tableQuery = db.exec("SELECT name FROM sqlite_master WHERE type='table'");
  
  if (tableQuery[0]) {
    for (const table of tableQuery[0].values) {
      const tableName = table[0];
      const result = db.exec(`SELECT * FROM ${tableName}`);
      
      if (result[0]) {
        const columns = result[0].columns;
        const rows = result[0].values.map(row => 
          Object.fromEntries(columns.map((col, i) => [col, row[i]]))
        );
        
        tables.push({
          tableName,
          columns,
          rows,
        });
      }
    }
  }

  return tables;
};

const parseTXT = async (file: File): Promise<any[]> => {
  const text = await file.text();
  const lines = text.split('\n');
  
  return lines.map((content, index) => ({
    line: index + 1,
    content: content.trim(),
  }));
};

const inferSchema = (data: any[]): SchemaField[] => {
  if (data.length === 0) return [];
  
  const sample = data[0];
  return Object.entries(sample).map(([name, value]) => ({
    name,
    type: inferType(value),
  }));
};

const inferType = (value: any): SchemaField['type'] => {
  if (typeof value === 'number') return 'number';
  if (typeof value === 'boolean') return 'boolean';
  if (value instanceof Date) return 'date';
  return 'string';
};