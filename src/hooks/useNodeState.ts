import { useState, useCallback } from 'react';
import { useFlowStore } from '@/store/flowStore';

interface UseNodeStateProps {
  nodeId: string;
  initialConfig?: any;
}

export function useNodeState({ nodeId, initialConfig = {} }: UseNodeStateProps) {
  const { getNodes, getEdges, updateNodes, updateEdges } = useFlowStore();
  const [config, setConfig] = useState(initialConfig);

  const handleDelete = useCallback(() => {
    const currentNodes = getNodes();
    const currentEdges = getEdges();
    
    const newNodes = currentNodes.filter((node) => node.id !== nodeId);
    const newEdges = currentEdges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId);
    
    updateNodes(newNodes);
    updateEdges(newEdges);
  }, [getNodes, getEdges, updateNodes, updateEdges, nodeId]);

  const handleConfigChange = useCallback((newConfig: any) => {
    setConfig(newConfig);
  }, []);

  return {
    config,
    handleDelete,
    handleConfigChange
  };
} 