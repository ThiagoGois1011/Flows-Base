import { useState, useCallback } from 'react';
import { ComponentItem, Flow, FlowNode, NodeConfig, NodeType } from '@/types';
import { Position } from 'reactflow';
import { useFlowStore } from '@/store/flowStore';

const getNodeLabel = (type: NodeType, config: NodeConfig): string => {
  switch (type) {
    case 'trigger':
      return config.type === 'init' ? 'Início' : 'Fim';
    case 'action':
      return config.type || 'Ação';
    case 'condition':
      return 'Condição';
    default:
      return 'Nó';
  }
};

export const useFlowNodes = () => {
  const { currentFlow, updateNodes, updateEdges, getNodes, getEdges } = useFlowStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<ComponentItem | null>(null);
  const [nodeConfig, setNodeConfig] = useState<NodeConfig>({});

  const handleComponentClick = useCallback((component: ComponentItem) => {
    setSelectedComponent(component);
    setNodeConfig({});
    setIsModalOpen(true);
  }, []);

  const handleCreateNode = useCallback(() => {
    console.log(nodeConfig); 
    console.log(selectedComponent); 
    if (!selectedComponent || !currentFlow) return;
    
    const newNode: FlowNode = {
      id: `${selectedComponent.id}-${Date.now()}`,
      type: selectedComponent.type,
      position: { x: 100, y: 100 },
      data: {
        label: getNodeLabel(selectedComponent.type, nodeConfig),
        type: nodeConfig.type,
        config: nodeConfig.config || {}
      }
    };

    const currentNodes = getNodes();
    updateNodes([...currentNodes, newNode]);

    setIsModalOpen(false);
    setSelectedComponent(null);
    setNodeConfig({});
  }, [selectedComponent, currentFlow, nodeConfig, getNodes, updateNodes]);

  const handleDeleteNode = useCallback((nodeId: string) => {
    if (!currentFlow) return;

    const currentNodes = getNodes();
    const currentEdges = getEdges();
    
    const newNodes = currentNodes.filter((node) => node.id !== nodeId);
    const newEdges = currentEdges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId);
    
    updateNodes(newNodes);
    updateEdges(newEdges);
  }, [currentFlow, getNodes, getEdges, updateNodes, updateEdges]);

  const handleUpdateNode = useCallback((nodeId: string, data: { label: string; type: NodeType; config?: NodeConfig }) => {
    if (!currentFlow) return;

    const currentNodes = getNodes();
    const newNodes = currentNodes.map((node) =>
      node.id === nodeId
        ? { ...node, data: { ...node.data, ...data } }
        : node
    );
    
    updateNodes(newNodes);
  }, [currentFlow, getNodes, updateNodes]);

  return {
    isModalOpen,
    setIsModalOpen,
    selectedComponent,
    setSelectedComponent,
    nodeConfig,
    setNodeConfig,
    handleComponentClick,
    handleCreateNode,
    handleDeleteNode,
    handleUpdateNode,
  };
}; 