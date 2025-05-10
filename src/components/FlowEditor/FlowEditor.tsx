"use client";
import React, { useCallback, useMemo } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  Connection,
  Edge,
  NodeChange,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import FlowSidebar from "./FlowSidebar";
import FlowTopbar from "./FlowTopbar";
import { CustomNode } from "./nodes";
import { useFlowStore } from "@/store/flowStore";
import { useFlowNodes } from "@/hooks/useFlowNodes";
import { TriggerNode, ActionNode, ConditionNode, DelayNode, WebhookNode } from "./CustomNodes";

const defaultEdgeOptions = {
  type: 'smoothstep',
  markerEnd: {
    type: MarkerType.ArrowClosed,
  },
  style: { strokeWidth: 2 },
};

export default function FlowEditor() {
  const { currentFlow } = useFlowStore();
  const {
    nodes,
    setNodes,
    edges,
    setEdges,
    handleDeleteNode,
    handleUpdateNode,
  } = useFlowNodes();

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: any) => {
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [setEdges]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, ...defaultEdgeOptions }, eds));
    },
    [setEdges]
  );

  const nodeTypes = useMemo(
    () => ({
      default: (props: any) => (
        <CustomNode
          {...props}
          onDelete={handleDeleteNode}
          onUpdate={handleUpdateNode}
        />
      ),
      trigger: TriggerNode,
      action: ActionNode,
      condition: ConditionNode,
      delay: DelayNode,
      webhook: WebhookNode,
    }),
    []
  );

  if (!currentFlow) {
    return <div>Carregando...</div>;
  }
  
  return (
    <div className="flex h-screen">
      <FlowSidebar />
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
    </div>
  );
} 