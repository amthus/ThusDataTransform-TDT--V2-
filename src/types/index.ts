export interface DataSource {
  id: string;
  name: string;
  type: 'csv' | 'excel' | 'json' | 'pdf' | 'docx' | 'sql' | 'txt';
  data: any[];
  schema: SchemaField[];
}

export interface SchemaField {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
}

export interface Transformation {
  id: string;
  type: 'filter' | 'sort' | 'group' | 'aggregate';
  config: any;
}

export interface Visualization {
  id: string;
  type: 'bar' | 'line' | 'pie' | 'scatter';
  dataSourceId: string;
  config: any;
}