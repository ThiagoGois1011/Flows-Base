import { Badge } from "@/components/ui/badge";
import { LightningBoltIcon, GearIcon, MixerHorizontalIcon, StopwatchIcon, GlobeIcon } from "@radix-ui/react-icons";
import { Handle, Position, NodeProps } from "reactflow";
import clsx from "clsx";

export function TriggerNode(props: NodeProps) {
  return (
    <div className="rounded-full border-2 border-yellow-400 bg-yellow-100 px-6 py-4 flex flex-col items-center shadow-md">
      <Badge className="bg-yellow-400 text-yellow-900 mb-1"><LightningBoltIcon className="mr-1" /> Gatilho</Badge>
      <span className="font-bold">{props.data?.label || "Início"}</span>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export function ActionNode(props: NodeProps) {
  return (
    <div className="rounded-lg border-2 border-blue-400 bg-blue-100 px-6 py-4 flex flex-col items-center shadow-md">
      <Badge className="bg-blue-400 text-blue-900 mb-1"><GearIcon className="mr-1" /> Ação</Badge>
      <span className="font-bold">{props.data?.label || "Ação"}</span>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export function ConditionNode(props: NodeProps) {
  return (
    <div className="rounded-lg border-2 border-orange-400 bg-orange-100 px-6 py-4 flex flex-col items-center shadow-md">
      <Badge className="bg-orange-400 text-orange-900 mb-1"><MixerHorizontalIcon className="mr-1" /> Condição</Badge>
      <span className="font-bold">{props.data?.label || "Condição"}</span>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export function DelayNode(props: NodeProps) {
  return (
    <div className="rounded-lg border-2 border-gray-400 bg-gray-100 px-6 py-4 flex flex-col items-center shadow-md">
      <Badge className="bg-gray-400 text-gray-900 mb-1"><StopwatchIcon className="mr-1" /> Atraso</Badge>
      <span className="font-bold">{props.data?.label || "Atraso"}</span>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export function WebhookNode(props: NodeProps) {
  return (
    <div className="rounded-lg border-2 border-green-400 bg-green-100 px-6 py-4 flex flex-col items-center shadow-md">
      <Badge className="bg-green-400 text-green-900 mb-1"><GlobeIcon className="mr-1" /> Webhook</Badge>
      <span className="font-bold">{props.data?.label || "Webhook"}</span>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
} 