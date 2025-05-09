import { ReactNode } from 'react';
import { Edge, Node, Position } from 'reactflow';

export interface Flow {
  id: string;
  attributes: FlowAttributes;
}

export interface FlowAttributes {
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  billing: string;
  published: boolean;
  uid: any;
  data: FlowData;
}

export interface FlowData {
  edges: Edge[];
  nodes: FlowNode[];
}

export interface FlowNode extends Node {
  data: {
    label: string;
    type: NodeType;
    config?: NodeConfig;
  };
  sourcePosition?: Position;
  targetPosition?: Position;
}

export type NodeType = 'trigger' | 'action' | 'condition';

export interface NodeConfig {
  triggerType?: 'init' | 'end';
  actionType?: 'whatsapp' | 'openai';
  whatsappAction?: 'receive_message' | 'send_message';
  openaiConfig?: {
    model: string;
    database: 'redis' | 'mysql';
    tool: 'create_assistant' | 'text_response' | 'audio_response';
  };
  conditionConfig?: {
    condition: string;
    truePath: string;
    falsePath: string;
  };
}

export interface ComponentItem {
  id: string;
  name: string;
  type: NodeType;
  icon?: ReactNode;
}

export interface FlowState {
  flows: Flow[];
  selectedFlow: string | null;
  isLoading: boolean;
  error: string | null;
} 