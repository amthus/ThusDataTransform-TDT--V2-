import { DataSource } from '../types';

export const applyTransformations = (data: any[], transformations: any[]) => {
  let transformedData = [...data];

  for (const transformation of transformations) {
    switch (transformation.type) {
      case 'filter':
        transformedData = applyFilter(transformedData, transformation.config);
        break;
      case 'sort':
        transformedData = applySort(transformedData, transformation.config);
        break;
      case 'group':
        transformedData = applyGrouping(transformedData, transformation.config);
        break;
      case 'aggregate':
        transformedData = applyAggregation(transformedData, transformation.config);
        break;
    }
  }

  return transformedData;
};

const applyFilter = (data: any[], config: any) => {
  if (!config.field || !config.operator || !config.value) return data;

  return data.filter(item => {
    const value = item[config.field];
    switch (config.operator) {
      case 'equals':
        return value === config.value;
      case 'contains':
        return String(value).includes(config.value);
      case 'greater':
        return value > config.value;
      case 'less':
        return value < config.value;
      default:
        return true;
    }
  });
};

const applySort = (data: any[], config: any) => {
  if (!config.field || !config.direction) return data;

  return [...data].sort((a, b) => {
    const valueA = a[config.field];
    const valueB = b[config.field];
    
    if (config.direction === 'asc') {
      return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
    } else {
      return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
    }
  });
};

const applyGrouping = (data: any[], config: any) => {
  if (!config.field) return data;

  const groups = data.reduce((acc, item) => {
    const key = item[config.field];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});

  return Object.entries(groups).map(([key, items]: [string, any[]]) => ({
    name: key,
    items,
    count: items.length
  }));
};

const applyAggregation = (data: any[], config: any) => {
  if (!config.field || !config.function) return data;

  const aggregated = data.reduce((acc, item) => {
    const value = Number(item[config.field]) || 0;
    
    switch (config.function) {
      case 'sum':
        acc.value += value;
        break;
      case 'avg':
        acc.sum += value;
        acc.count += 1;
        break;
      case 'min':
        acc.value = Math.min(acc.value, value);
        break;
      case 'max':
        acc.value = Math.max(acc.value, value);
        break;
    }
    
    return acc;
  }, { value: 0, sum: 0, count: 0 });

  if (config.function === 'avg') {
    return [{ value: aggregated.sum / aggregated.count }];
  }

  return [{ value: aggregated.value }];
};