import { create } from 'zustand';
import { DataSource, Transformation, Visualization } from '../types';
import { applyTransformations } from '../utils/transformations';

interface DataStore {
  dataSources: DataSource[];
  transformations: Transformation[];
  visualizations: Visualization[];
  addDataSource: (dataSource: DataSource) => void;
  addTransformation: (transformation: Transformation) => void;
  updateTransformation: (id: string, updates: Partial<Transformation>) => void;
  removeTransformation: (id: string) => void;
  addVisualization: (visualization: Visualization) => void;
  updateVisualization: (id: string, updates: Partial<Visualization>) => void;
  removeVisualization: (id: string) => void;
  getTransformedData: (dataSourceId: string) => any[];
}

export const useDataStore = create<DataStore>((set, get) => ({
  dataSources: [],
  transformations: [],
  visualizations: [],
  
  addDataSource: (dataSource) =>
    set((state) => ({
      dataSources: [...state.dataSources, dataSource],
    })),
    
  addTransformation: (transformation) =>
    set((state) => ({
      transformations: [...state.transformations, transformation],
    })),

  updateTransformation: (id, updates) =>
    set((state) => ({
      transformations: state.transformations.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
    })),

  removeTransformation: (id) =>
    set((state) => ({
      transformations: state.transformations.filter((t) => t.id !== id),
    })),
    
  addVisualization: (visualization) =>
    set((state) => ({
      visualizations: [...state.visualizations, visualization],
    })),

  updateVisualization: (id, updates) =>
    set((state) => ({
      visualizations: state.visualizations.map((v) =>
        v.id === id ? { ...v, ...updates } : v
      ),
    })),

  removeVisualization: (id) =>
    set((state) => ({
      visualizations: state.visualizations.filter((v) => v.id !== id),
    })),

  getTransformedData: (dataSourceId) => {
    const state = get();
    const dataSource = state.dataSources.find((ds) => ds.id === dataSourceId);
    if (!dataSource) return [];
    return applyTransformations(dataSource.data, state.transformations);
  },
}));