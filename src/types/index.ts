import { ReactNode } from 'react';

export interface Flow {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ComponentItem {
  id: string;
  name: string;
  icon: ReactNode;
  description?: string;
  category: 'trigger' | 'action' | 'condition' | 'delay' | 'webhook';
}

export interface FlowState {
  flows: Flow[];
  selectedFlow: string | null;
  isLoading: boolean;
  error: string | null;
} 