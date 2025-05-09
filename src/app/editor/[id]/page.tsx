'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import FlowEditor from '@/components/FlowEditor/FlowEditor';
import { useFlowStore } from '@/store/flowStore';

export default function FlowEditorPage() {
  const params = useParams();
  const { setCurrentFlow, currentFlow, isLoading, error } = useFlowStore();

  useEffect(() => {
    if (params.id && (!currentFlow || currentFlow.id !== params.id)) {
      setCurrentFlow(params.id as string);
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-destructive">{error}</p>
        <button
          onClick={() => setCurrentFlow(params.id as string)}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!currentFlow) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-destructive">Flow não encontrado</p>
      </div>
    );
  }

  return <FlowEditor />;
} 