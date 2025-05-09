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
import { useRouter } from 'next/navigation';
import { useFlowStore } from '@/store/flowStore';

export default function FlowActions() {
  const [isSelectorModalOpen, setIsSelectorModalOpen] = React.useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [newFlowName, setNewFlowName] = React.useState('');
  const router = useRouter();
  const { createFlow, isLoading, error } = useFlowStore();

  const handleSelectFlow = () => {
    setIsSelectorModalOpen(true);
  };

  const handleCreateFlow = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateFlowSubmit = async () => {
    if (!newFlowName.trim()) {
      return;
    }

    const newFlow = await createFlow(newFlowName);
    if (newFlow) {
      setIsCreateModalOpen(false);
      setNewFlowName('');
      router.push(`/editor/${newFlow.id}`);
    }
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
          <DialogHeader>
            <DialogTitle>Criar Novo Flow</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Nome do Flow"
              value={newFlowName}
              onChange={(e) => setNewFlowName(e.target.value)}
              className={error ? "border-destructive" : ""}
              disabled={isLoading}
            />
            {error && (
              <p className="text-sm text-destructive mt-2">{error}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateFlowSubmit}
              disabled={isLoading || !newFlowName.trim()}
            >
              {isLoading ? 'Criando...' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 