import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { useDataStore } from '../../store/dataStore';
import { parseFile } from '../../utils/fileParser';

export const FileUploader: React.FC = () => {
  const addDataSource = useDataStore((state) => state.addDataSource);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      const result = await parseFile(file);
      if (result) {
        addDataSource(result);
      }
    }
  }, [addDataSource]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/json': ['.json'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/x-sql': ['.sql'],
      'text/plain': ['.txt']
    }
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
    >
      <input {...getInputProps()} />
      <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
      {isDragActive ? (
        <p className="text-blue-500">Drop the files here...</p>
      ) : (
        <div>
          <p className="text-gray-600">Drag & drop files here, or click to select files</p>
          <p className="text-sm text-gray-400 mt-2">
            Supports CSV, Excel, JSON, PDF, Word, SQL, and TXT
          </p>
        </div>
      )}
    </div>
  );
};