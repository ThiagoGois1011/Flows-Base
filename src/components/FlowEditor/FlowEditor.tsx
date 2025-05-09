"use client";
import React, { useCallback, useState, useMemo, useEffect } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeTypes,
  EdgeTypes,
  NodeChange,
  Position,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import FlowSidebar from "./FlowSidebar";
import FlowTopbar from "./FlowTopbar";
import { ComponentItem, Flow, FlowNode, NodeConfig, NodeType } from "@/types";
import { CustomNode } from "./nodes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useFlowStore } from "@/store/flowStore";
import { useParams } from "next/navigation";

const defaultEdgeOptions = {
  type: 'smoothstep',
  markerEnd: {
    type: MarkerType.ArrowClosed,
  },
  style: { strokeWidth: 2 },
};

export default function FlowEditor() {
  const params = useParams();
  const { currentFlow, flows, setCurrentFlow, updateFlow, fetchFlows } = useFlowStore();
  const [nodes, setNodes] = useState<FlowNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<ComponentItem | null>(null);
  const [nodeConfig, setNodeConfig] = useState<NodeConfig>({});

  useEffect(() => {
    if (currentFlow?.attributes.data?.nodes) {
      setNodes(currentFlow.attributes.data.nodes);
    }
    if (currentFlow?.attributes.data?.edges) {
      setEdges(currentFlow.attributes.data.edges);
    }
  }, [currentFlow]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    []
  );

  const onEdgesChange = useCallback(
    (changes: any) => {
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    []
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, ...defaultEdgeOptions }, eds));
    },
    []
  );

  const handleComponentClick = (component: ComponentItem) => {
    setSelectedComponent(component);
    setNodeConfig({});
    setIsModalOpen(true);
  };

  const handleCreateNode = () => {
    if (!selectedComponent || !currentFlow) return;

    const newNode: FlowNode = {
      id: `${selectedComponent.id}-${Date.now()}`,
      type: selectedComponent.type,
      position: { x: 100, y: 100 },
      data: {
        label: selectedComponent.name,
        type: selectedComponent.type,
        config: nodeConfig
      },
      sourcePosition: selectedComponent.type === 'trigger' && nodeConfig.triggerType === 'init' ? Position.Right : undefined,
      targetPosition: selectedComponent.type === 'trigger' && nodeConfig.triggerType === 'end' ? Position.Left : undefined,
    };

    if (selectedComponent.type === 'condition') {
      newNode.sourcePosition = Position.Right;
      newNode.targetPosition = Position.Left;
    }

    const newNodes = [...nodes, newNode];
    setNodes(newNodes);
    updateFlow(currentFlow.id, {
      attributes: {
        ...currentFlow.attributes,
        data: {
          ...currentFlow.attributes.data,
          nodes: newNodes,
        },
      },
    });

    setIsModalOpen(false);
    setSelectedComponent(null);
    setNodeConfig({});
  };

  const handleDeleteNode = (nodeId: string) => {
    if (!currentFlow) return;

    const newNodes = nodes.filter((node) => node.id !== nodeId);
    const newEdges = edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId);
    
    setNodes(newNodes);
    setEdges(newEdges);
    
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
  };

  const handleUpdateNode = (nodeId: string, data: { label: string; type: NodeType; config?: NodeConfig }) => {
    if (!currentFlow) return;

    const newNodes = nodes.map((node) =>
      node.id === nodeId
        ? { ...node, data: { ...node.data, ...data } }
        : node
    );
    
    setNodes(newNodes);
    updateFlow(currentFlow.id, {
      attributes: {
        ...currentFlow.attributes,
        data: {
          ...currentFlow.attributes.data,
          nodes: newNodes,
        },
      },
    });
  };

  const nodeTypes = useMemo(
    () => ({
      default: (props: any) => (
        <CustomNode
          {...props}
          onDelete={handleDeleteNode}
          onUpdate={handleUpdateNode}
        />
      ),
    }),
    []
  );

  const renderModalContent = () => {
    if (!selectedComponent) return null;

    switch (selectedComponent.type) {
      case 'trigger':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Gatilho</label>
              <Select
                value={nodeConfig.triggerType}
                onValueChange={(value: 'init' | 'end') => setNodeConfig({ ...nodeConfig, triggerType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="init">Início</SelectItem>
                  <SelectItem value="end">Fim</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'action':
        if (!nodeConfig.actionType) {
          return (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de Ação</label>
                <Select
                  value={nodeConfig.actionType}
                  onValueChange={(value: 'whatsapp' | 'openai') => setNodeConfig({ ...nodeConfig, actionType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="openai">OpenAI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          );
        }

        if (nodeConfig.actionType === 'whatsapp') {
          return (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Ação do WhatsApp</label>
                <Select
                  value={nodeConfig.whatsappAction}
                  onValueChange={(value: 'receive_message' | 'send_message') => 
                    setNodeConfig({ ...nodeConfig, whatsappAction: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a ação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="receive_message">Receber Mensagem</SelectItem>
                    <SelectItem value="send_message">Enviar Mensagem</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          );
        }

        if (nodeConfig.actionType === 'openai') {
          return (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Modelo</label>
                <Select
                  value={nodeConfig.openaiConfig?.model}
                  onValueChange={(value) => 
                    setNodeConfig({
                      ...nodeConfig,
                      openaiConfig: { ...nodeConfig.openaiConfig, model: value }
                    })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Banco de Dados</label>
                <Select
                  value={nodeConfig.openaiConfig?.database}
                  onValueChange={(value: 'redis' | 'mysql') => 
                    setNodeConfig({
                      ...nodeConfig,
                      openaiConfig: { ...nodeConfig.openaiConfig, database: value }
                    })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o banco" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="redis">Redis</SelectItem>
                    <SelectItem value="mysql">MySQL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Ferramenta</label>
                <Select
                  value={nodeConfig.openaiConfig?.tool}
                  onValueChange={(value: 'create_assistant' | 'text_response' | 'audio_response') => 
                    setNodeConfig({
                      ...nodeConfig,
                      openaiConfig: { ...nodeConfig.openaiConfig, tool: value }
                    })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a ferramenta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="create_assistant">Criar Assistente</SelectItem>
                    <SelectItem value="text_response">Responder com Texto</SelectItem>
                    <SelectItem value="audio_response">Responder com Áudio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          );
        }
        break;

      case 'condition':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Condição</label>
              <Input
                value={nodeConfig.conditionConfig?.condition || ''}
                onChange={(e) => 
                  setNodeConfig({
                    ...nodeConfig,
                    conditionConfig: { ...nodeConfig.conditionConfig, condition: e.target.value }
                  })}
                placeholder="Digite a condição"
              />
            </div>
          </div>
        );
    }

    return null;
  };

  if (!currentFlow) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="flex h-screen">
      <FlowSidebar onComponentClick={handleComponentClick} />
      <div className="flex-1">
        <FlowTopbar />
        <div className="h-[calc(100vh-48px)]">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            defaultEdgeOptions={defaultEdgeOptions}
            fitView
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedComponent?.type === 'trigger' && 'Criar Gatilho'}
              {selectedComponent?.type === 'action' && 'Criar Ação'}
              {selectedComponent?.type === 'condition' && 'Criar Condição'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {renderModalContent()}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateNode}>
              Criar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 