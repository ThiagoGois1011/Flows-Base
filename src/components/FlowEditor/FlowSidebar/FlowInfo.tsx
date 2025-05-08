import React from 'react';
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFlow } from "@/lib/api";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface FlowInfoProps {
  flowName: string;
  flowId: string;
}

export const FlowInfo: React.FC<FlowInfoProps> = ({ flowName, flowId }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const deleteFlowMutation = useMutation({
    mutationFn: () => deleteFlow(flowId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flows'] });
      setIsDeleteModalOpen(false);
      router.push('/');
    },
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <span className="font-medium text-base truncate">{flowName}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => setIsDeleteModalOpen(true)}
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      </div>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {deleteFlowMutation.isError ? "Erro ao deletar flow" : "Deletar flow"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {deleteFlowMutation.isError ? (
              <p className="text-destructive">
                {deleteFlowMutation.error?.message || "Erro ao deletar flow"}
              </p>
            ) : (
              <p>Tem certeza que deseja deletar este flow?</p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancelar
            </Button>
            {!deleteFlowMutation.isError && (
              <Button
                variant="destructive"
                onClick={() => deleteFlowMutation.mutate()}
                disabled={deleteFlowMutation.isPending}
              >
                {deleteFlowMutation.isPending ? "Deletando..." : "Deletar"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}; 