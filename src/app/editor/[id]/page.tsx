'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import FlowEditor from '@/components/FlowEditor/FlowEditor';
import { getFlowById } from '@/lib/api';
import { log } from 'console';

export default function FlowEditorPage() {
  const params = useParams();
  const [flow, setFlow] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFlow = async () => {
      try {
        setIsLoading(true);
        const response = await getFlowById(params.id as string);
        setFlow(response);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar o flow');
        console.error('Erro ao carregar flow:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadFlow();
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
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!flow) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-destructive">Flow não encontrado</p>
      </div>
    );
  }

  return <FlowEditor flow={flow.data} />;
} 