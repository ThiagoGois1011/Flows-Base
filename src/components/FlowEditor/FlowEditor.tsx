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
import { ComponentItem } from "@/types";
import { CustomNode } from "./nodes";

export interface FlowData {
  id: number
  attributes: Attributes
}

export interface Attributes {
  name: string
  status: string
  createdAt: string
  updatedAt: string
  billing: string
  published: boolean
  uid: any
  data: Data
}

export interface Data {
  edges: Edge[]
  nodes: Node[]
}

export interface Node {
  id: string
  data: {
    label: string
    type: string
  }
  type: string
  position: Position
  sourcePosition?: Position
  targetPosition?: Position
}

export interface Position {
  x: number
  y: number
}

interface FlowEditorProps {
  flow: FlowData;
}

const edgeTypes: EdgeTypes = {
  default: ReactFlow.Edge,
};

const defaultEdgeOptions = {
  type: 'smoothstep',
  markerEnd: {
    type: MarkerType.ArrowClosed,
  },
  style: { strokeWidth: 2 },
};

export default function FlowEditor({ flow }: FlowEditorProps) {
  const [nodes, setNodes] = useState<Node[]>(flow.attributes.data?.nodes || []);
  const [edges, setEdges] = useState<Edge[]>(flow.attributes.data?.edges || []);

  useEffect(() => {
    if (flow.attributes.data?.nodes) {
      setNodes(flow.attributes.data.nodes);
    }
    if (flow.attributes.data?.edges) {
      setEdges(flow.attributes.data.edges);
    }
  }, [flow]);

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
    const newNode: Node = {
      id: `${component.id}-${Date.now()}`,
      type: 'default',
      position: { x: 100, y: 100 },
      data: { 
        label: component.name,
        type: component.type || 'default'
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    };
    
    setNodes((nds) => [...nds, newNode]);
  };

  const handleDeleteNode = (nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  };

  const handleUpdateNode = (nodeId: string, data: { label: string; type: string }) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } }
          : node
      )
    );
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

  return (
    <div className="flex h-screen">
      <FlowSidebar onComponentClick={handleComponentClick} flow={flow} />
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
    </div>
  );
} 