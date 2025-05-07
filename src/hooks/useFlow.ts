import { useState, useCallback } from 'react';
import { Flow, FlowState } from '@/types';

export const useFlow = () => {
  const [state, setState] = useState<FlowState>({
    flows: [],
    selectedFlow: null,
    isLoading: false,
    error: null,
  });

  const fetchFlows = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      // Implementar chamada à API
      const flows: Flow[] = [];
      setState(prev => ({ ...prev, flows, isLoading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Erro ao carregar flows',
        isLoading: false,
      }));
    }
  }, []);

  const addFlow = useCallback(async (flow: Omit<Flow, 'id' | 'createdAt' | 'updatedAt'>) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      // Implementar chamada à API
      const newFlow: Flow = {
        ...flow,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setState(prev => ({
        ...prev,
        flows: [...prev.flows, newFlow],
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Erro ao adicionar flow',
        isLoading: false,
      }));
    }
  }, []);

  const selectFlow = useCallback((flowId: string) => {
    setState(prev => ({ ...prev, selectedFlow: flowId }));
  }, []);

  return {
    ...state,
    fetchFlows,
    addFlow,
    selectFlow,
  };
}; 