import { create } from 'zustand';
import { Flow, FlowNode, FlowState } from '@/types';
import { getFlows, createFlow as createFlowApi, getFlowById } from '@/lib/api';
import { Edge } from 'reactflow';

interface FlowStore extends FlowState {
  currentFlow: Flow | null;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  // Estados de edição do nó
  isEditDialogOpen: boolean;
  editingNodeId: string | null;
  editingNodeLabel: string;
  editingNodeType: string;
  editingNodeData: any;
  setEditDialogOpen: (open: boolean) => void;
  setEditingNode: (nodeId: string | null, label: string, type: string, data: any) => void;
  fetchFlows: () => Promise<void>;
  createFlow: (name: string) => Promise<void>;
  setCurrentFlow: (flowId: string) => Promise<void>;
  updateFlow: (flow: Flow) => void;
  getNodes: () => FlowNode[];
  getEdges: () => Edge[];
  updateNodes: (nodes: FlowNode[]) => void;
  updateEdges: (edges: Edge[]) => void;
  // Estados do modal e configuração
  isModalOpen: boolean;
  selectedComponent: ComponentItem | null;
  nodeConfig: NodeConfig;
  setModalOpen: (open: boolean) => void;
  setSelectedComponent: (component: ComponentItem | null) => void;
  setNodeConfig: (config: NodeConfig) => void;
}

export const useFlowStore = create<FlowStore>((set, get) => ({
  flows: [],
  selectedFlow: null,
  currentFlow: null,
  currentStep: 1,
  isLoading: false,
  error: null,
  isEditDialogOpen: false,
  editingNodeId: null,
  editingNodeLabel: "",
  editingNodeType: "",
  editingNodeData: {},
  isModalOpen: false,
  selectedComponent: null,
  nodeConfig: {},

  setCurrentStep: (step: number) => set({ currentStep: step }),

  getNodes: () => get().currentFlow?.attributes.data.nodes || [],
  getEdges: () => get().currentFlow?.attributes.data.edges || [],

  updateNodes: (nodes: FlowNode[]) => {
    const currentFlow = get().currentFlow;
    if (!currentFlow) return;

    set((state) => ({
      currentFlow: {
        ...state.currentFlow!,
        attributes: {
          ...state.currentFlow!.attributes,
          data: {
            ...state.currentFlow!.attributes.data,
            nodes,
          },
        },
      },
    }));
  },

  updateEdges: (edges: Edge[]) => {
    const currentFlow = get().currentFlow;
    if (!currentFlow) return;

    set((state) => ({
      currentFlow: {
        ...state.currentFlow!,
        attributes: {
          ...state.currentFlow!.attributes,
          data: {
            ...state.currentFlow!.attributes.data,
            edges,
          },
        },
      },
    }));
  },

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

  updateFlow: (flow: Flow) => {
    set((state) => ({
      flows: state.flows.map((f) =>
        f.id === flow.id ? flow : f
      ),
      currentFlow: state.currentFlow?.id === flow.id
        ? flow
        : state.currentFlow,
    }));
  },

  setEditDialogOpen: (open: boolean) => set({ isEditDialogOpen: open }),
  
  setEditingNode: (nodeId: string | null, label: string, type: string, data: any) => 
    set({ 
      editingNodeId: nodeId,
      editingNodeLabel: label,
      editingNodeType: type,
      editingNodeData: data
    }),

  setModalOpen: (open: boolean) => set({ isModalOpen: open }),
  setSelectedComponent: (component: ComponentItem | null) => set({ selectedComponent: component }),
  setNodeConfig: (config: NodeConfig) => set({ nodeConfig: config }),
})); 