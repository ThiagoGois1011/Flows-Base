import React, { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFlows } from '@/lib/api';

interface Flow {
  id: string;
  attributes: {
    name: string;
    description?: string;
  };
}

interface FlowContextData {
  flows: Flow[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

const FlowContext = createContext<FlowContextData>({} as FlowContextData);

export function FlowProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['flows'],
    queryFn: async () => {
      const response = await getFlows();
      return response.data;
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <FlowContext.Provider
      value={{
        flows: data || [],
        isLoading,
        error: error as Error,
        refetch,
      }}
    >
      {children}
    </FlowContext.Provider>
  );
}

export function useFlows() {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error('useFlows must be used within a FlowProvider');
  }
  return context;
} 