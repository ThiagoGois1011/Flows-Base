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
          <Handle type="source" position={Position.Right} id="true" />
          <Handle type="source" position={Position.Right} id="false" style={{ top: '70%' }} />
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
  const [isHovered, setIsHovered] = useState(false);
  const { getNodes, getEdges, updateNodes, updateEdges } = useFlowStore();
  
  const nodeType = props.data?.type || 'init';

  const handleDelete = useCallback(() => {
    const currentNodes = getNodes();
    const currentEdges = getEdges();
    
    const newNodes = currentNodes.filter((node) => node.id !== props.id);
    const newEdges = currentEdges.filter((edge) => edge.source !== props.id && edge.target !== props.id);
    
    updateNodes(newNodes);
    updateEdges(newEdges);
  }, [getNodes, getEdges, updateNodes, updateEdges, props.id]);

  const handleEdit = useCallback(() => {
    if (props.onEditClick) {
      props.onEditClick(props.id, props.data?.label || 'Gatilho');
    }
  }, [props.onEditClick, props.id, props.data?.label]);

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
        className={`rounded-lg border-2 border-yellow-400 bg-yellow-100 px-6 py-4 flex flex-col items-center shadow-md transition-all duration-200 ${
          isHovered ? 'shadow-lg' : ''
        }`}
      >
        <Badge className="bg-yellow-400 text-yellow-900 mb-1">
          <LightningBoltIcon className="mr-1" /> Gatilho
        </Badge>
        <span className="font-bold">{props.data?.label || 'Gatilho'}</span>
        {nodeType === 'init' && <Handle type="source" position={Position.Right} />}
        {nodeType === 'end' && <Handle type="target" position={Position.Left} />}
      </div>
    </div>
  );
}

export function ActionNode(props: NodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { getNodes, getEdges, updateNodes, updateEdges } = useFlowStore();

  const handleDelete = useCallback(() => {
    const currentNodes = getNodes();
    const currentEdges = getEdges();
    
    const newNodes = currentNodes.filter((node) => node.id !== props.id);
    const newEdges = currentEdges.filter((edge) => edge.source !== props.id && edge.target !== props.id);
    
    updateNodes(newNodes);
    updateEdges(newEdges);
  }, [getNodes, getEdges, updateNodes, updateEdges, props.id]);

  const handleEdit = useCallback(() => {
    if (props.onEditClick) {
      props.onEditClick(props.id, props.data?.label || 'Ação');
    }
  }, [props.onEditClick, props.id, props.data?.label]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

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

  const style = getNodeStyle();

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
        className={`rounded-lg border-2 ${style.border} ${style.bg} px-6 py-4 flex flex-col items-center shadow-md transition-all duration-200 ${
          isHovered ? 'shadow-lg' : ''
        }`}
      >
        <Badge className={`${style.badge} ${style.text} mb-1`}>
          {props.data?.type === 'whatsapp' ? (
            <>
              <ChatBubbleIcon className="mr-1" /> WhatsApp
            </>
          ) : props.data?.type === 'openai' ? (
            <>
              <RocketIcon className="mr-1" /> OpenAI
            </>
          ) : (
            <>
              <GearIcon className="mr-1" /> Ação
            </>
          )}
        </Badge>
        <span className="font-bold">{props.data?.label || 'Ação'}</span>
        <Handle type="target" position={Position.Left} />
        <Handle type="source" position={Position.Right} />
      </div>
    </div>
  );
}

export function ConditionNode(props: NodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { getNodes, getEdges, updateNodes, updateEdges } = useFlowStore();

  const handleDelete = useCallback(() => {
    const currentNodes = getNodes();
    const currentEdges = getEdges();
    
    const newNodes = currentNodes.filter((node) => node.id !== props.id);
    const newEdges = currentEdges.filter((edge) => edge.source !== props.id && edge.target !== props.id);
    
    updateNodes(newNodes);
    updateEdges(newEdges);
  }, [getNodes, getEdges, updateNodes, updateEdges, props.id]);

  const handleEdit = useCallback(() => {
    if (props.onEditClick) {
      props.onEditClick(props.id, props.data?.label || 'Condição');
    }
  }, [props.onEditClick, props.id, props.data?.label]);

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
        className={`rounded-lg border-2 border-orange-400 bg-orange-100 px-6 py-4 flex flex-col items-center shadow-md transition-all duration-200 ${
          isHovered ? 'shadow-lg' : ''
        }`}
      >
        <Badge className="bg-orange-400 text-orange-900 mb-1">
          <MixerHorizontalIcon className="mr-1" /> Condição
        </Badge>
        <span className="font-bold">{props.data?.label || 'Condição'}</span>
        <Handle type="target" position={Position.Left} />
        <Handle 
          type="source" 
          position={Position.Right} 
          id="true"
          style={{ top: '30%' }}
        />
        <Handle 
          type="source" 
          position={Position.Right} 
          id="false"
          style={{ top: '70%' }}
        />
      </div>
    </div>
  );
}

export function DelayNode(props: NodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { getNodes, getEdges, updateNodes, updateEdges } = useFlowStore();

  const handleDelete = useCallback(() => {
    const currentNodes = getNodes();
    const currentEdges = getEdges();
    
    const newNodes = currentNodes.filter((node) => node.id !== props.id);
    const newEdges = currentEdges.filter((edge) => edge.source !== props.id && edge.target !== props.id);
    
    updateNodes(newNodes);
    updateEdges(newEdges);
  }, [getNodes, getEdges, updateNodes, updateEdges, props.id]);

  const handleEdit = useCallback(() => {
    if (props.onEditClick) {
      props.onEditClick(props.id, props.data?.label || 'Atraso');
    }
  }, [props.onEditClick, props.id, props.data?.label]);

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
        className={`rounded-lg border-2 border-gray-400 bg-gray-100 px-6 py-4 flex flex-col items-center shadow-md transition-all duration-200 ${
          isHovered ? 'shadow-lg' : ''
        }`}
      >
        <Badge className="bg-gray-400 text-gray-900 mb-1">
          <StopwatchIcon className="mr-1" /> Atraso
        </Badge>
        <span className="font-bold">{props.data?.label || 'Atraso'}</span>
        <Handle type="target" position={Position.Left} />
        <Handle type="source" position={Position.Right} />
      </div>
    </div>
  );
}

export function WebhookNode(props: NodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { getNodes, getEdges, updateNodes, updateEdges } = useFlowStore();

  const handleDelete = useCallback(() => {
    const currentNodes = getNodes();
    const currentEdges = getEdges();
    
    const newNodes = currentNodes.filter((node) => node.id !== props.id);
    const newEdges = currentEdges.filter((edge) => edge.source !== props.id && edge.target !== props.id);
    
    updateNodes(newNodes);
    updateEdges(newEdges);
  }, [getNodes, getEdges, updateNodes, updateEdges, props.id]);

  const handleEdit = useCallback(() => {
    if (props.onEditClick) {
      props.onEditClick(props.id, props.data?.label || 'Webhook');
    }
  }, [props.onEditClick, props.id, props.data?.label]);

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
        className={`rounded-lg border-2 border-green-400 bg-green-100 px-6 py-4 flex flex-col items-center shadow-md transition-all duration-200 ${
          isHovered ? 'shadow-lg' : ''
        }`}
      >
        <Badge className="bg-green-400 text-green-900 mb-1">
          <GlobeIcon className="mr-1" /> Webhook
        </Badge>
        <span className="font-bold">{props.data?.label || 'Webhook'}</span>
        <Handle type="target" position={Position.Left} />
        <Handle type="source" position={Position.Right} />
      </div>
    </div>
  );
} 