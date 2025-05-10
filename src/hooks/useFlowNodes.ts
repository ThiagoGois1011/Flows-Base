import { useState, useCallback, useEffect } from 'react';
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
  const { currentFlow, updateFlow } = useFlowStore();
  const [nodes, setNodes] = useState<FlowNode[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<ComponentItem | null>(null);
  const [nodeConfig, setNodeConfig] = useState<NodeConfig>({});
  
  useEffect(() => {
    if (currentFlow?.attributes?.data) {
      setNodes(currentFlow.attributes.data.nodes || []);
      setEdges(currentFlow.attributes.data.edges || []);
    }
  }, [currentFlow]);

  const handleComponentClick = useCallback((component: ComponentItem) => {
    setSelectedComponent(component);
    setNodeConfig({});
    setIsModalOpen(true);
  }, []);

  const handleCreateNode = useCallback(() => {
    if (!selectedComponent || !currentFlow) return;
    
    const newNode: FlowNode = {
      id: `${selectedComponent.id}-${Date.now()}`,
      type: selectedComponent.type,
      position: { x: 100, y: 100 },
      data: {
        label: getNodeLabel(selectedComponent.type, nodeConfig),
        type: nodeConfig.type,
        config: nodeConfig.config
      }
    };

    setNodes(prevNodes => {
      const newNodes = [...prevNodes, newNode];
      updateFlow(currentFlow.id, {
        attributes: {
          ...currentFlow.attributes,
          data: {
            ...currentFlow.attributes.data,
            nodes: newNodes,
          },
        },
      });
      return newNodes;
    });

    setIsModalOpen(false);
    setSelectedComponent(null);
    setNodeConfig({});
  }, [selectedComponent, currentFlow, nodeConfig, updateFlow]);

  const handleDeleteNode = useCallback((nodeId: string) => {
    if (!currentFlow) return;

    setNodes(prevNodes => {
      const newNodes = prevNodes.filter((node) => node.id !== nodeId);
      setEdges(prevEdges => {
        const newEdges = prevEdges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId);
        updateFlow(currentFlow.id, {
          attributes: {
            ...currentFlow.attributes,
            data: {
              ...currentFlow.attributes.data,
              nodes: newNodes,
              edges: newEdges,
            },
          },
        });
        return newEdges;
      });
      return newNodes;
    });
  }, [currentFlow, updateFlow]);

  const handleUpdateNode = useCallback((nodeId: string, data: { label: string; type: NodeType; config?: NodeConfig }) => {
    if (!currentFlow) return;

    setNodes(prevNodes => {
      const newNodes = prevNodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } }
          : node
      );
      updateFlow(currentFlow.id, {
        attributes: {
          ...currentFlow.attributes,
          data: {
            ...currentFlow.attributes.data,
            nodes: newNodes,
          },
        },
      });
      return newNodes;
    });
  }, [currentFlow, updateFlow]);

  return {
    nodes,
    setNodes,
    edges,
    setEdges,
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