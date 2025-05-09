import { create } from 'zustand';
import { Flow, FlowState } from '@/types';
import { getFlows, createFlow as createFlowApi, getFlowById } from '@/lib/api';

interface FlowStore extends FlowState {
  currentFlow: Flow | null;
  fetchFlows: () => Promise<void>;
  createFlow: (name: string) => Promise<void>;
  setCurrentFlow: (flowId: string) => Promise<void>;
  updateFlow: (flowId: string, data: Partial<Flow>) => void;
}

export const useFlowStore = create<FlowStore>((set, get) => ({
  flows: [],
  selectedFlow: null,
  currentFlow: null,
  isLoading: false,
  error: null,

  fetchFlows: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getFlows();
      set({ flows: response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Erro ao carregar flows', isLoading: false });
    }
  },

  createFlow: async (name: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await createFlowApi(name);
      set((state) => ({
        flows: [...state.flows, response.data],
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      set({ error: 'Erro ao criar flow', isLoading: false });
      throw error;
    }
  },

  setCurrentFlow: async (flowId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getFlowById(flowId);
      set({ currentFlow: response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Erro ao carregar flow', isLoading: false });
    }
  },

  updateFlow: (flowId: string, data: Partial<Flow>) => {
    set((state) => ({
      flows: state.flows.map((flow) =>
        flow.id === flowId ? { ...flow, ...data } : flow
      ),
      currentFlow: state.currentFlow?.id === flowId
        ? { ...state.currentFlow, ...data }
        : state.currentFlow,
    }));
  },
})); 