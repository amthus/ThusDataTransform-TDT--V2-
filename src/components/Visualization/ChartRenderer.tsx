import React from 'react';
import {
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  ScatterChart as RechartsScatterChart,
  PieChart as RechartsPieChart,
  Bar,
  Line,
  Scatter,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { Visualization, DataSource } from '../../types';
import { useDataStore } from '../../store/dataStore';

interface ChartRendererProps {
  visualization: Visualization;
  dataSource?: DataSource;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const ChartRenderer: React.FC<ChartRendererProps> = ({ visualization, dataSource }) => {
  const getTransformedData = useDataStore((state) => state.getTransformedData);

  if (!dataSource) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">Please select a data source</p>
      </div>
    );
  }

  const data = getTransformedData(dataSource.id);

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    switch (visualization.type) {
      case 'bar':
        return (
          <RechartsBarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </RechartsBarChart>
        );

      case 'line':
        return (
          <RechartsLineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </RechartsLineChart>
        );

      case 'scatter':
        return (
          <RechartsScatterChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" />
            <YAxis dataKey="y" />
            <Tooltip />
            <Legend />
            <Scatter name="Data" data={data} fill="#8884d8" />
          </RechartsScatterChart>
        );

      case 'pie':
        return (
          <RechartsPieChart {...commonProps}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {data.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </RechartsPieChart>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};