import React from 'react';
import { Transformation } from '../../types';

interface TransformationConfigProps {
  transformation: Transformation;
  onConfigChange: (config: any) => void;
  fields: string[];
}

export const TransformationConfig: React.FC<TransformationConfigProps> = ({
  transformation,
  onConfigChange,
  fields,
}) => {
  const renderFilterConfig = () => (
    <div className="space-y-2">
      <select
        className="w-full p-2 border rounded"
        value={transformation.config.field || ''}
        onChange={(e) => onConfigChange({ ...transformation.config, field: e.target.value })}
      >
        <option value="">Select Field</option>
        {fields.map((field) => (
          <option key={field} value={field}>
            {field}
          </option>
        ))}
      </select>
      <select
        className="w-full p-2 border rounded"
        value={transformation.config.operator || ''}
        onChange={(e) => onConfigChange({ ...transformation.config, operator: e.target.value })}
      >
        <option value="">Select Operator</option>
        <option value="equals">Equals</option>
        <option value="contains">Contains</option>
        <option value="greater">Greater Than</option>
        <option value="less">Less Than</option>
      </select>
      <input
        type="text"
        className="w-full p-2 border rounded"
        placeholder="Value"
        value={transformation.config.value || ''}
        onChange={(e) => onConfigChange({ ...transformation.config, value: e.target.value })}
      />
    </div>
  );

  const renderSortConfig = () => (
    <div className="space-y-2">
      <select
        className="w-full p-2 border rounded"
        value={transformation.config.field || ''}
        onChange={(e) => onConfigChange({ ...transformation.config, field: e.target.value })}
      >
        <option value="">Select Field</option>
        {fields.map((field) => (
          <option key={field} value={field}>
            {field}
          </option>
        ))}
      </select>
      <select
        className="w-full p-2 border rounded"
        value={transformation.config.direction || ''}
        onChange={(e) => onConfigChange({ ...transformation.config, direction: e.target.value })}
      >
        <option value="">Select Direction</option>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );

  const renderAggregateConfig = () => (
    <div className="space-y-2">
      <select
        className="w-full p-2 border rounded"
        value={transformation.config.field || ''}
        onChange={(e) => onConfigChange({ ...transformation.config, field: e.target.value })}
      >
        <option value="">Select Field</option>
        {fields.map((field) => (
          <option key={field} value={field}>
            {field}
          </option>
        ))}
      </select>
      <select
        className="w-full p-2 border rounded"
        value={transformation.config.function || ''}
        onChange={(e) => onConfigChange({ ...transformation.config, function: e.target.value })}
      >
        <option value="">Select Function</option>
        <option value="sum">Sum</option>
        <option value="avg">Average</option>
        <option value="min">Minimum</option>
        <option value="max">Maximum</option>
      </select>
    </div>
  );

  switch (transformation.type) {
    case 'filter':
      return renderFilterConfig();
    case 'sort':
      return renderSortConfig();
    case 'group':
      return (
        <select
          className="w-full p-2 border rounded"
          value={transformation.config.field || ''}
          onChange={(e) => onConfigChange({ field: e.target.value })}
        >
          <option value="">Select Field</option>
          {fields.map((field) => (
            <option key={field} value={field}>
              {field}
            </option>
          ))}
        </select>
      );
    case 'aggregate':
      return renderAggregateConfig();
    default:
      return null;
  }
};