import React from 'react';
import { Filter, SortAsc, Group, Calculator, X } from 'lucide-react';
import { useDataStore } from '../../store/dataStore';
import { TransformationConfig } from './TransformationConfig';

export const TransformationPanel: React.FC = () => {
  const { transformations, dataSources, addTransformation, updateTransformation, removeTransformation } = useDataStore();

  const transformationTypes = [
    { type: 'filter', icon: Filter, label: 'Filter' },
    { type: 'sort', icon: SortAsc, label: 'Sort' },
    { type: 'group', icon: Group, label: 'Group' },
    { type: 'aggregate', icon: Calculator, label: 'Aggregate' },
  ];

  const fields = dataSources[0]?.schema.map(field => field.name) || [];

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Transformations</h2>
      <div className="grid grid-cols-2 gap-3">
        {transformationTypes.map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            onClick={() => addTransformation({ id: crypto.randomUUID(), type: type as any, config: {} })}
            className="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100"
          >
            <Icon className="w-5 h-5 mr-2" />
            <span>{label}</span>
          </button>
        ))}
      </div>
      
      <div className="mt-4 space-y-4">
        <h3 className="text-sm font-medium">Applied Transformations</h3>
        {transformations.map((transformation) => (
          <div key={transformation.id} className="bg-gray-50 p-3 rounded">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">
                {transformation.type.charAt(0).toUpperCase() + transformation.type.slice(1)}
              </span>
              <button
                onClick={() => removeTransformation(transformation.id)}
                className="text-gray-400 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <TransformationConfig
              transformation={transformation}
              onConfigChange={(config) => updateTransformation(transformation.id, { config })}
              fields={fields}
            />
          </div>
        ))}
      </div>
    </div>
  );
};