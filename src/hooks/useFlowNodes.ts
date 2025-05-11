import { useState, useCallback } from 'react';
import { ComponentItem, Flow, FlowNode, NodeConfig, NodeType } from '@/types';
import { Position } from 'reactflow';
import { useFlowStore } from '@/store/flowStore';

export const getNodeLabel = (type: NodeType, config: NodeConfig): string => {
  switch (type) {
    case 'trigger':
      return config.type === 'init' ? 'Início' : 'Fim';
    case 'action':
      if (config.type === 'whatsapp') {
        return config.config?.action === 'receive_message' ? 'Receber Mensagem' : 'Enviar Mensagem';
      }
      if (config.type === 'openai') {
        switch (config.config?.action) {
          case 'response_with_text':
            return 'Responder com Texto';
          case 'response_with_audio':
            return 'Responder com Áudio';
          case 'generate_image':
            return 'Gerar Imagem';
          default:
            return 'Ação OpenAI';
        }
      }
      return config.type || 'Ação';
    case 'condition':
      return config.config?.condition || 'Condição';
    case 'webhook':
      return 'Webhook';
    case 'delay':
      return 'Atraso';
    default:
      return 'Nó';
  }
};

export const useFlowNodes = () => {
  const { 
    currentFlow, 
    updateNodes, 
    updateEdges, 
    getNodes, 
    getEdges,
    isModalOpen,
    nodeConfig,
    setModalOpen,
    setSelectedComponent,
    setNodeConfig
  } = useFlowStore();

  const handleComponentClick = useCallback((component: ComponentItem) => {
    setSelectedComponent(component);
    setNodeConfig({});
    setModalOpen(true);
  }, [setSelectedComponent, setNodeConfig, setModalOpen]);

  const handleCreateNode = useCallback((component: ComponentItem, customNodeConfig?: NodeConfig) => {
    if (!currentFlow) return;
    
    const configToUse = customNodeConfig || nodeConfig;
    
    const newNode: FlowNode = {
      id: `${component.id}-${Date.now()}`,
      type: component.type,
      position: { x: 100, y: 100 },
      data: {
        label: getNodeLabel(component.type, configToUse),
        type: configToUse.type || '',
        config: configToUse.config || {}
      }
    };

    const currentNodes = getNodes();
    updateNodes([...currentNodes, newNode]);

    setModalOpen(false);
    setSelectedComponent(null);
    setNodeConfig({});

    return newNode.id;
  }, [currentFlow, nodeConfig, getNodes, setModalOpen, setSelectedComponent, setNodeConfig]);

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
    handleComponentClick,
    handleCreateNode,
    handleDeleteNode,
    handleUpdateNode,
    getNodeLabel,
  };
}; 