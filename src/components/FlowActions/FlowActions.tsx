import React from 'react';
import { Button } from "@/components/ui/button";
import FlowSelectorModal from "../FlowSelectorModal/FlowSelectorModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createFlow } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Cross2Icon } from "@radix-ui/react-icons";

export default function FlowActions() {
  const [isSelectorModalOpen, setIsSelectorModalOpen] = React.useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [newFlowName, setNewFlowName] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  const createFlowMutation = useMutation({
    mutationFn: createFlow,
    onSuccess: (data) => {
      setIsCreateModalOpen(false);
      setNewFlowName('');
      setError(null);
      router.push(`/editor/${data.data.id}`);
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Erro ao criar flow');
    }
  });

  const handleSelectFlow = () => {
    setIsSelectorModalOpen(true);
  };

  const handleCreateFlow = () => {
    setIsCreateModalOpen(true);
    setError(null);
  };

  const handleCreateFlowSubmit = () => {
    if (!newFlowName.trim()) {
      setError('Erro ao criar flow');
      return;
    }
    createFlowMutation.mutate(newFlowName);
  };

  return (
    <>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={handleSelectFlow}
        >
          Selecione um Flow
        </Button>
        <Button 
          variant="default" 
          className="flex-1"
          onClick={handleCreateFlow}
        >
          Criar Flow
        </Button>
      </div>

      <FlowSelectorModal 
        isOpen={isSelectorModalOpen}
        onClose={() => setIsSelectorModalOpen(false)}
      />

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader className="relative">
            <DialogTitle>Criar Novo Flow</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 h-8 w-8 rounded-full hover:border hover:border-black/10"
              onClick={() => setIsCreateModalOpen(false)}
            >
              <Cross2Icon className="h-5 w-5" />
            </Button>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Nome do Flow"
              value={newFlowName}
              onChange={(e) => setNewFlowName(e.target.value)}
              className={error ? "border-destructive" : ""}
            />
            {error && (
              <p className="text-sm text-destructive mt-2">{error}</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleCreateFlowSubmit}
              disabled={createFlowMutation.isPending}
            >
              {createFlowMutation.isPending ? "Criando..." : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 