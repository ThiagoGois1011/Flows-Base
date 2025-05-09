import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrashIcon, Pencil1Icon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NodeConfig, NodeType } from "@/types";

interface CustomNodeProps {
  data: {
    label: string;
    type: NodeType;
    config?: NodeConfig;
  };
  id: string;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: { label: string; type: NodeType; config?: NodeConfig }) => void;
}

const nodeTypes = {
  trigger: "bg-blue-100 border-blue-500",
  action: "bg-green-100 border-green-500",
  condition: "bg-yellow-100 border-yellow-500",
  default: "bg-gray-100 border-gray-500",
};

export const CustomNode = ({ data, id, onDelete, onUpdate }: CustomNodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  const [type, setType] = useState(data.type);
  const [config, setConfig] = useState<NodeConfig>(data.config || {});

  const handleDelete = () => {
    onDelete(id);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdate(id, { label, type, config });
    setIsEditing(false);
  };

  const nodeStyle = nodeTypes[type] || nodeTypes.default;

  const renderNodeContent = () => {
    switch (data.type) {
      case 'trigger':
        return (
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-medium">Gatilho</span>
            <span className="text-xs text-muted-foreground">{data.label}</span>
            {data.config?.triggerType && (
              <span className="text-xs text-muted-foreground">
                {data.config.triggerType === 'init' ? 'Início' : 'Fim'}
              </span>
            )}
          </div>
        );

      case 'action':
        return (
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-medium">Ação</span>
            <span className="text-xs text-muted-foreground">{data.label}</span>
            {data.config?.actionType && (
              <span className="text-xs text-muted-foreground">
                {data.config.actionType === 'whatsapp' ? 'WhatsApp' : 'OpenAI'}
              </span>
            )}
          </div>
        );

      case 'condition':
        return (
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-medium">Condição</span>
            <span className="text-xs text-muted-foreground">{data.label}</span>
            {data.config?.conditionConfig?.condition && (
              <span className="text-xs text-muted-foreground">
                {data.config.conditionConfig.condition}
              </span>
            )}
          </div>
        );

      default:
        return <span className="text-sm font-medium">{data.label}</span>;
    }
  };

  return (
    <>
      <div className="relative">
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-white shadow-md hover:bg-destructive hover:text-white"
            onClick={handleDelete}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-white shadow-md hover:bg-primary hover:text-white"
            onClick={handleEdit}
          >
            <Pencil1Icon className="h-4 w-4" />
          </Button>
        </div>
        <Card className={`p-4 ${nodeStyle}`}>
          <div className="flex items-center justify-between gap-2">
            {data.type !== 'trigger' || (data.type === 'trigger' && data.config?.triggerType !== 'end') ? (
              <Handle
                type="target"
                position={Position.Left}
                className="w-3 h-3 !bg-primary"
              />
            ) : null}
            {renderNodeContent()}
            {data.type !== 'trigger' || (data.type === 'trigger' && data.config?.triggerType !== 'init') ? (
              <Handle
                type="source"
                position={Position.Right}
                className="w-3 h-3 !bg-primary"
              />
            ) : null}
          </div>
        </Card>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Nó</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome do nó</label>
              <Input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Nome do nó"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo do nó</label>
              <Select value={type} onValueChange={(value: NodeType) => setType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trigger">Gatilho</SelectItem>
                  <SelectItem value="action">Ação</SelectItem>
                  <SelectItem value="condition">Condição</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}; 