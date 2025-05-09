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

interface CustomNodeProps {
  data: {
    label: string;
    type: string;
  };
  id: string;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: { label: string; type: string }) => void;
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
  const [type, setType] = useState(data.type || "default");

  const handleDelete = () => {
    onDelete(id);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdate(id, { label, type });
    setIsEditing(false);
  };

  const nodeStyle = nodeTypes[type as keyof typeof nodeTypes] || nodeTypes.default;

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
        <Card className={`px-4 py-2 min-w-[150px] border-2 ${nodeStyle}`}>
          <div className="flex items-center justify-between gap-2">
            <Handle
              type="target"
              position={Position.Left}
              className="w-3 h-3 !bg-primary"
            />
            <span className="text-sm font-medium">{data.label}</span>
            <Handle
              type="source"
              position={Position.Right}
              className="w-3 h-3 !bg-primary"
            />
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
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trigger">Trigger</SelectItem>
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