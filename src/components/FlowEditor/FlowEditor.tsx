"use client";
import React, { useCallback, useState, useMemo } from "react";
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
} from "reactflow";
import "reactflow/dist/style.css";
import FlowSidebar from "./FlowSidebar";
import FlowTopbar from "./FlowTopbar";

// Definindo os tipos de nós e arestas fora do componente
const nodeTypes: NodeTypes = {
  default: ReactFlow.Node,
  trigger: ReactFlow.Node,
  action: ReactFlow.Node,
  condition: ReactFlow.Node,
};

const edgeTypes: EdgeTypes = {
  default: ReactFlow.Edge,
};

interface FlowData {
  edges: Edge[];
  nodes: Node[];
}

interface FlowAttributes {
  name: string;
  description?: string;
  data: FlowData;
}

interface Flow {
  id: number;
  attributes: FlowAttributes;
}

// Função para validar e formatar os nodes
const formatNodes = (nodes: Node[]): Node[] => {
  if (!Array.isArray(nodes)) return [];
  
  return nodes.map((node, index) => {
    // Garante que o node tenha um ID
    const id = node.id || `node-${index}`;
    
    // Garante que o node tenha uma posição válida
    const position = {
      x: node.position?.x ?? 0,
      y: node.position?.y ?? 0,
    };

    // Garante que o node tenha dados válidos
    const data = {
      label: node.data?.label || 'Node',
      ...node.data,
    };

    return {
      id,
      type: node.type || 'default',
      position,
      data,
      width: node.width || 150,
      height: node.height || 40,
      selected: node.selected || false,
      dragging: node.dragging || false,
    };
  });
};

// Função para validar e formatar as edges
const formatEdges = (edges: Edge[]): Edge[] => {
  if (!Array.isArray(edges)) return [];
  
  return edges.map((edge, index) => ({
    id: edge.id || `edge-${index}`,
    source: edge.source,
    target: edge.target,
    type: edge.type || 'default',
  }));
};

export default function FlowEditor({ flow }: { flow: Flow }) {
  const [nodes, setNodes] = useState<Node[]>(() => 
    formatNodes(flow.attributes.data.nodes || [])
  );
  const [edges, setEdges] = useState<Edge[]>(() => 
    formatEdges(flow.attributes.data.edges || [])
  );

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => {
      return nds.map((node) => {
        const change = changes.find((c) => c.id === node.id);
        if (!change) return node;

        // Preserva os dados originais do node
        const updatedNode = { ...node };

        if (change.type === 'position' && 'position' in change) {
          updatedNode.position = change.position;
        } else if (change.type === 'dimensions' && 'dimensions' in change) {
          updatedNode.width = change.dimensions.width;
          updatedNode.height = change.dimensions.height;
        } else if (change.type === 'select') {
          updatedNode.selected = change.selected;
        }

        return updatedNode;
      });
    });
  }, []);

  // Atualiza os nodes e edges quando o flow mudar
  React.useEffect(() => {
    if (flow.attributes.data.nodes) {
      setNodes(formatNodes(flow.attributes.data.nodes));
    }
    if (flow.attributes.data.edges) {
      setEdges(formatEdges(flow.attributes.data.edges));
    }
  }, [flow]);

  // Memoize o ReactFlow para evitar re-renders desnecessários
  const reactFlowInstance = useMemo(() => (
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={setEdges}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    ), [nodes, edges, onConnect, onNodesChange]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <FlowSidebar />
      <div style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column" }}>
        <FlowTopbar flowName={flow.attributes.name} />
        <div style={{ flex: 1, height: "100%" }}>
          {reactFlowInstance}
        </div>
      </div>
    </div>
  );
} 