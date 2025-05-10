import { Badge } from "@/components/ui/badge";
import { LightningBoltIcon, GearIcon, MixerHorizontalIcon, StopwatchIcon, GlobeIcon, TrashIcon, Pencil1Icon } from "@radix-ui/react-icons";
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
        <Handle type="target" position={Position.Left} />
        <Handle type="source" position={Position.Right} />
      </div>
    </div>
  );
}

export function TriggerNode(props: NodeProps) {
  return (
    <BaseNode
      {...props}
      nodeStyle={{
        border: "border-yellow-400",
        bg: "bg-yellow-100",
        badge: "bg-yellow-400",
        text: "text-yellow-900"
      }}
      icon={<LightningBoltIcon className="mr-1" />}
      type="Gatilho"
    />
  );
}

export function ActionNode(props: NodeProps) {
  return (
    <BaseNode
      {...props}
      nodeStyle={{
        border: "border-blue-400",
        bg: "bg-blue-100",
        badge: "bg-blue-400",
        text: "text-blue-900"
      }}
      icon={<GearIcon className="mr-1" />}
      type="Ação"
    />
  );
}

export function ConditionNode(props: NodeProps) {
  return (
    <BaseNode
      {...props}
      nodeStyle={{
        border: "border-orange-400",
        bg: "bg-orange-100",
        badge: "bg-orange-400",
        text: "text-orange-900"
      }}
      icon={<MixerHorizontalIcon className="mr-1" />}
      type="Condição"
    />
  );
}

export function DelayNode(props: NodeProps) {
  return (
    <BaseNode
      {...props}
      nodeStyle={{
        border: "border-gray-400",
        bg: "bg-gray-100",
        badge: "bg-gray-400",
        text: "text-gray-900"
      }}
      icon={<StopwatchIcon className="mr-1" />}
      type="Atraso"
    />
  );
}

export function WebhookNode(props: NodeProps) {
  return (
    <BaseNode
      {...props}
      nodeStyle={{
        border: "border-green-400",
        bg: "bg-green-100",
        badge: "bg-green-400",
        text: "text-green-900"
      }}
      icon={<GlobeIcon className="mr-1" />}
      type="Webhook"
    />
  );
} 