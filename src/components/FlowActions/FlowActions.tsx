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

export default function FlowActions() {
  const [isSelectorModalOpen, setIsSelectorModalOpen] = React.useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [newFlowName, setNewFlowName] = React.useState('');
  const router = useRouter();

  const handleSelectFlow = () => {
    setIsSelectorModalOpen(true);
  };

  const handleCreateFlow = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateFlowSubmit = async () => {
    try {
      const response = await createFlow(newFlowName);
      setIsCreateModalOpen(false);
      setNewFlowName('');
      router.push(`/editor/${response.data.id}`);
    } catch (error) {
      console.error('Erro ao criar flow:', error);
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
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateFlowSubmit}>
              Criar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 