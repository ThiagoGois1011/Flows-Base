import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { useRouter } from 'next/navigation';
import { useFlowStore } from '@/store/flowStore';

interface FlowSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FlowSelectorModal({ isOpen, onClose }: FlowSelectorModalProps) {
  const { flows, isLoading, error } = useFlowStore();
  const [currentPage, setCurrentPage] = React.useState(0);
  const router = useRouter();
  const itemsPerPage = 9;
  const totalPages = Math.ceil(flows.length / itemsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  const handleFlowSelect = (flowId: string) => {
    router.push(`/editor/${flowId}`);
    onClose();
  };

  const currentFlows = flows.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Selecione um Flow</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-[400px] gap-4">
            <p className="text-destructive">Erro ao carregar os flows</p>
            <Button onClick={() => fetchFlows()}>Tentar novamente</Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4">
              {currentFlows.map((flow) => (
                <Card
                  key={flow.id}
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => handleFlowSelect(flow.id)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{flow.attributes.name}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 0}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Página {currentPage + 1} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages - 1}
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
} 