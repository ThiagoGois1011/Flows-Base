import React, { useState } from 'react';
import { useFlowStore } from '@/store/flowStore';
import { Pencil1Icon } from "@radix-ui/react-icons";

export default function FlowRightSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [jsonContent, setJsonContent] = useState('');
  const { currentFlow, updateFlow } = useFlowStore();

  const handleOpen = () => {
    if (currentFlow) {
      setJsonContent(JSON.stringify(currentFlow, null, 2));
    }
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleApply = () => {
    try {
      const parsedJson = JSON.parse(jsonContent);
      updateFlow(parsedJson);
      setIsOpen(false);
    } catch (error) {
      alert('JSON inválido. Por favor, verifique o formato.');
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="fixed top-20 right-4 z-50 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-colors"
        title="Editar Flow"
      >
        <Pencil1Icon className="w-5 h-5" />
      </button>

      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-60 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 h-full flex flex-col">
          <h2 className="text-xl font-bold mb-4">Editar Flow</h2>
          
          <textarea
            value={jsonContent}
            onChange={(e) => setJsonContent(e.target.value)}
            className="flex-1 p-2 border rounded-md font-mono text-sm resize-none"
            placeholder="Cole o JSON do flow aqui..."
          />

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
            >
              Cancelar
            </button>
            <button
              onClick={handleApply}
              className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
            >
              Aplicar
            </button>
          </div>
        </div>
      </div>
    </>
  );
} 