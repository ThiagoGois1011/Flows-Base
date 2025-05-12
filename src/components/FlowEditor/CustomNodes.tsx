import { Badge } from "@/components/ui/badge";
import { LightningBoltIcon, GearIcon, MixerHorizontalIcon, StopwatchIcon, GlobeIcon, TrashIcon, Pencil1Icon, ChatBubbleIcon, RocketIcon } from "@radix-ui/react-icons";
import { Handle, Position, NodeProps } from "reactflow";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, useCallback } from "react";
import { useFlowStore } from "@/store/flowStore";
import { BaseNode } from './BaseNode';
import { useNodeState } from '@/hooks/useNodeState';

interface BaseNodeProps extends NodeProps {
  onEditClick?: (nodeId: string, label: string) => void;
  nodeStyle: {
    border: string;
    bg: string;
    badge: string;
    text: string;
  };
  icon: React.ReactNode;
  type: string;
}

export function BaseNode({ data, id, onEditClick, nodeStyle, icon, type }: BaseNodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { getNodes, getEdges, updateNodes, updateEdges } = useFlowStore();

  const handleDelete = useCallback(() => {
    const currentNodes = getNodes();
    const currentEdges = getEdges();
    
    const newNodes = currentNodes.filter((node) => node.id !== id);
    const newEdges = currentEdges.filter((edge) => edge.source !== id && edge.target !== id);
    
    updateNodes(newNodes);
    updateEdges(newEdges);
  }, [getNodes, getEdges, updateNodes, updateEdges, id]);

  const handleEdit = useCallback(() => {
    if (onEditClick) {
      onEditClick(id, data?.label || type);
    }
  }, [onEditClick, id, data?.label, type]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const renderHandles = () => {
    if (type === 'trigger') {
      if (data?.type === 'init') {
        return <Handle type="source" position={Position.Right} />;
      } else if (data?.type === 'end') {
        return <Handle type="target" position={Position.Left} />;
      }
    }

    if (type === 'condition') {
      return (
        <>
          <Handle type="target" position={Position.Left} />
          <Handle type="source" position={Position.Right} id="true" style={{ top: '40%' }}/>
          <Handle type="source" position={Position.Right} id="false" style={{ top: '80%' }} />
        </>
      );
    }

    return (
      <>
        <Handle type="target" position={Position.Left} />
        <Handle type="source" position={Position.Right} />
      </>
    );
  };

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className={`absolute -top-10 left-1/2 transform -translate-x-1/2 flex gap-2 transition-all duration-200 ease-in-out ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}
      >
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-white shadow-md hover:bg-destructive hover:text-white transition-colors duration-200"
          onClick={handleDelete}
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-white shadow-md hover:bg-primary hover:text-white transition-colors duration-200"
          onClick={handleEdit}
        >
          <Pencil1Icon className="h-4 w-4" />
        </Button>
      </div>
      <div 
        className={`rounded-lg border-2 ${nodeStyle.border} ${nodeStyle.bg} px-6 py-4 flex flex-col items-center shadow-md transition-all duration-200 ${
          isHovered ? 'shadow-lg' : ''
        }`}
      >
        <Badge className={`${nodeStyle.badge} ${nodeStyle.text} mb-1`}>{icon} {type}</Badge>
        <span className="font-bold">{data?.label || type}</span>
        {renderHandles()}
      </div>
    </div>
  );
}

export function TriggerNode(props: NodeProps) {
  const { handleDelete } = useNodeState({ nodeId: props.id });
  const nodeType = props.data?.type || 'init';

  const nodeStyle = {
    border: "border-yellow-400",
    bg: "bg-yellow-100",
    badge: "bg-yellow-400",
    text: "text-yellow-900"
  };

  return (
    <BaseNode
      id={props.id}
      data={props.data}
      onEditClick={props.onEditClick}
      onDelete={handleDelete}
      icon={<LightningBoltIcon className="mr-1" />}
      type="trigger"
      nodeStyle={nodeStyle}
    />
  );
}

export function ActionNode(props: NodeProps) {
  const { handleDelete } = useNodeState({ nodeId: props.id });

  const getNodeStyle = () => {
    switch (props.data?.type) {
      case 'whatsapp':
        return {
          border: "border-green-400",
          bg: "bg-green-100",
          badge: "bg-green-400",
          text: "text-green-900"
        };
      case 'openai':
        return {
          border: "border-purple-400",
          bg: "bg-purple-100",
          badge: "bg-purple-400",
          text: "text-purple-900"
        };
      default:
        return {
          border: "border-blue-400",
          bg: "bg-blue-100",
          badge: "bg-blue-400",
          text: "text-blue-900"
        };
    }
  };

  const getIcon = () => {
    switch (props.data?.type) {
      case 'whatsapp':
        return <ChatBubbleIcon className="mr-1" />;
      case 'openai':
        return <RocketIcon className="mr-1" />;
      default:
        return <GearIcon className="mr-1" />;
    }
  };

  const getType = () => {
    switch (props.data?.type) {
      case 'whatsapp':
        return "WhatsApp";
      case 'openai':
        return "OpenAI";
      default:
        return "Ação";
    }
  };

  return (
    <BaseNode
      id={props.id}
      data={props.data}
      onEditClick={props.onEditClick}
      onDelete={handleDelete}
      icon={getIcon()}
      type={getType()}
      nodeStyle={getNodeStyle()}
    />
  );
}

export function ConditionNode(props: NodeProps) {
  const { handleDelete } = useNodeState({ nodeId: props.id });

  const nodeStyle = {
    border: "border-orange-400",
    bg: "bg-orange-100",
    badge: "bg-orange-400",
    text: "text-orange-900"
  };

  return (
    <BaseNode
      id={props.id}
      data={props.data}
      onEditClick={props.onEditClick}
      onDelete={handleDelete}
      icon={<MixerHorizontalIcon className="mr-1" />}
      type="condition"
      nodeStyle={nodeStyle}
    />
  );
}

export function DelayNode(props: NodeProps) {
  const { handleDelete } = useNodeState({ nodeId: props.id });

  const nodeStyle = {
    border: "border-gray-400",
    bg: "bg-gray-100",
    badge: "bg-gray-400",
    text: "text-gray-900"
  };

  return (
    <BaseNode
      id={props.id}
      data={props.data}
      onEditClick={props.onEditClick}
      onDelete={handleDelete}
      icon={<StopwatchIcon className="mr-1" />}
      type="Atraso"
      nodeStyle={nodeStyle}
    />
  );
}

export function WebhookNode(props: NodeProps) {
  const { handleDelete } = useNodeState({ nodeId: props.id });

  const nodeStyle = {
    border: "border-green-400",
    bg: "bg-green-100",
    badge: "bg-green-400",
    text: "text-green-900"
  };

  return (
    <BaseNode
      id={props.id}
      data={props.data}
      onEditClick={props.onEditClick}
      onDelete={handleDelete}
      icon={<GlobeIcon className="mr-1" />}
      type="Webhook"
      nodeStyle={nodeStyle}
    />
  );
} 