import React from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { FileUploader } from './components/DataImport/FileUploader';
import { TransformationPanel } from './components/DataTransform/TransformationPanel';
import { VisualizationPanel } from './components/Visualization/VisualizationPanel';
import { Database } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center">
          <Database className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">ThusDataTransform-TDT--V2-</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <PanelGroup direction="horizontal">
          <Panel defaultSize={25} minSize={20}>
            <div className="h-[calc(100vh-8rem)] overflow-y-auto space-y-4">
              <FileUploader />
              <TransformationPanel />
            </div>
          </Panel>
          
          <PanelResizeHandle className="w-2 bg-gray-200 hover:bg-gray-300 transition-colors" />
          
          <Panel defaultSize={75}>
            <div className="h-[calc(100vh-8rem)] overflow-y-auto p-4 bg-white rounded-lg shadow">
              <VisualizationPanel />
            </div>
          </Panel>
        </PanelGroup>
      </main>
    </div>
  );
}

export default App;