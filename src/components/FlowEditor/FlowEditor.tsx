"use client";
import React, { useCallback, useMemo, useState } from "react";
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
  NodeProps,
} from "reactflow";
import "reactflow/dist/style.css";
import FlowSidebar from "./FlowSidebar";
import FlowTopbar from "./FlowTopbar";
import FlowRightSidebar from "./FlowRightSidebar";
import { useFlowStore } from "@/store/flowStore";
import { useFlowNodes } from "@/hooks/useFlowNodes";
import { TriggerNode, ActionNode, ConditionNode, DelayNode, WebhookNode } from "./CustomNodes";
import { NodeEditDialog } from "./NodeEditDialog";
import { CustomEdge } from "./CustomEdge";

const defaultEdgeOptions = {
  type: 'custom',
  markerEnd: {
    type: MarkerType.ArrowClosed,
  },
  style: { strokeWidth: 2 },
};

export default function FlowEditor() {
  const { 
    currentFlow, 
    getNodes, 
    getEdges, 
    updateNodes, 
    updateEdges,
    isEditDialogOpen,
    editingNodeId,
    editingNodeLabel,
    editingNodeType,
    editingNodeData,
    setEditDialogOpen,
    setEditingNode
  } = useFlowStore();
  console.log(getNodes());
  
  const {
    handleCreateNode,
    getNodeLabel,
  } = useFlowNodes();

  const handleNodeEdit = useCallback((nodeId: string, data: any) => {
    const currentNodes = getNodes();
    
    const newNodes = currentNodes.map((node) =>
      node.id === nodeId
        ? { ...node, data: { ...node.data, ...data } }
        : node
    );
    updateNodes(newNodes);
  }, [getNodes, updateNodes]);

  const handleEditClick = useCallback((nodeId: string, label: string) => {
    console.log(nodeId, label);
    
    const node = getNodes().find(n => n.id === nodeId);
    if (node) {
      setEditingNode(nodeId, label, node.type, node.data);
      setEditDialogOpen(true);
    }
  }, [getNodes, setEditingNode, setEditDialogOpen]);

  const handleEdgeDelete = useCallback((edgeId: string) => {
    const currentEdges = getEdges();
    const newEdges = currentEdges.filter((edge) => edge.id !== edgeId);
    updateEdges(newEdges);
  }, [getEdges, updateEdges]);

  const onNodesChange = useCallback(
    (changes: any) => {
      const currentNodes = getNodes();
      const newNodes = applyNodeChanges(changes, currentNodes);
      updateNodes(newNodes);
    },
    [getNodes, updateNodes]
  );

  const onEdgesChange = useCallback(
    (changes: any) => {
      const currentEdges = getEdges();
      const newEdges = applyEdgeChanges(changes, currentEdges);
      updateEdges(newEdges);
    },
    [getEdges, updateEdges]
  );

  const onConnect = useCallback(
    (connection: any) => {
      const currentEdges = getEdges();
      const sourceNode = getNodes().find(node => node.id === connection.source);
      
      let edgeData = {};
      if (sourceNode?.type === 'condition') {
        edgeData = {
          condition: connection.sourceHandle === 'true' ? 'true' : 'false'
        };
      }
      
      const newEdges = addEdge({
        ...connection,
        data: edgeData
      }, currentEdges);
      updateEdges(newEdges);
    },
    [getEdges, getNodes, updateEdges]
  );

  const nodeTypes = useMemo(
    () => ({
      trigger: (props: NodeProps) => <TriggerNode {...props} onEditClick={handleEditClick} />,
      action: (props: NodeProps) => <ActionNode {...props} onEditClick={handleEditClick} />,
      condition: (props: NodeProps) => <ConditionNode {...props} onEditClick={handleEditClick} />,
      delay: (props: NodeProps) => <DelayNode {...props} onEditClick={handleEditClick} />,
      webhook: (props: NodeProps) => <WebhookNode {...props} onEditClick={handleEditClick} />,
    }),
    [handleEditClick]
  );

  const edgeTypes = useMemo(
    () => ({
      custom: (props: any) => <CustomEdge {...props} onDelete={handleEdgeDelete} />,
    }),
    [handleEdgeDelete]
  );

  const getPreviousNode = useCallback((nodeId: string) => {
    const edges = getEdges();
    const nodes = getNodes();
    
    const incomingEdge = edges.find(edge => edge.target === nodeId);
    if (!incomingEdge) return null;
    
    const previousNode = nodes.find(node => node.id === incomingEdge.source);
    return previousNode || null;
  }, [getEdges, getNodes]);

  if (!currentFlow) {
    return <div>Carregando...</div>;
  }
  
  return (
    <div className="flex h-screen">
      <FlowSidebar onNodeCreated={(nodeId, label, type, data) => {
        setEditingNode(nodeId, label, type, data);
        setEditDialogOpen(true);
      }} />
      <div className="flex-1">
        <FlowTopbar />
        <div className="h-[calc(100vh-48px)]">
          <ReactFlow
            nodes={getNodes()}
            edges={getEdges()}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            defaultEdgeOptions={defaultEdgeOptions}
            fitView
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>
      </div>

      <FlowRightSidebar />

      <NodeEditDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setEditDialogOpen}
        nodeId={editingNodeId}
        initialLabel={editingNodeLabel}
        nodeType={editingNodeType}
        initialData={editingNodeData}
        onSave={handleNodeEdit}
        onCreateNode={handleCreateNode}
        onEditClick={handleEditClick}
        previousNode={editingNodeId ? getPreviousNode(editingNodeId) : null}
      />
    </div>
  );
} 