import React from 'react';
import { BarChart, LineChart, PieChart, ScatterChart } from 'lucide-react';
import { useDataStore } from '../../store/dataStore';
import { ChartRenderer } from './ChartRenderer';

export const VisualizationPanel: React.FC = () => {
  const { visualizations, dataSources, addVisualization } = useDataStore();

  const chartTypes = [
    { type: 'bar', icon: BarChart, label: 'Bar Chart' },
    { type: 'line', icon: LineChart, label: 'Line Chart' },
    { type: 'pie', icon: PieChart, label: 'Pie Chart' },
    { type: 'scatter', icon: ScatterChart, label: 'Scatter Plot' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Add Visualization</h2>
        <div className="grid grid-cols-2 gap-3">
          {chartTypes.map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              onClick={() => 
                addVisualization({
                  id: crypto.randomUUID(),
                  type: type as any,
                  dataSourceId: dataSources[0]?.id || '',
                  config: {}
                })
              }
              className="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100"
            >
              <Icon className="w-5 h-5 mr-2" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {visualizations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visualizations.map((visualization) => (
            <div key={visualization.id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium mb-4">
                {visualization.type.charAt(0).toUpperCase() + visualization.type.slice(1)} Chart
              </h3>
              <ChartRenderer
                visualization={visualization}
                dataSource={dataSources.find(ds => ds.id === visualization.dataSourceId)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};