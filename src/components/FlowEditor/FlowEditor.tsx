"use client";
import React, { useCallback, useState } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  Connection,
  Edge,
  Node,
} from "reactflow";
import "reactflow/dist/style.css";
import FlowSidebar from "./FlowSidebar";
import FlowTopbar from "./FlowTopbar";

export default function FlowEditor({ flow }: { flow: any }) {
  const [nodes, setNodes] = useState<Node[]>(flow.nodes || []);
  const [edges, setEdges] = useState<Edge[]>(flow.edges || []);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <FlowSidebar />
      <div style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column" }}>
        <FlowTopbar />
        <div style={{ flex: 1, height: "100%" }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={setNodes}
            onEdgesChange={setEdges}
            onConnect={onConnect}
            fitView
          >
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
} 