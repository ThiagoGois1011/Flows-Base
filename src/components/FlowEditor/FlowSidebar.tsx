import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LightningBoltIcon, GearIcon, StopwatchIcon, GlobeIcon, MixerHorizontalIcon, PlusIcon } from "@radix-ui/react-icons";
import React from "react";
import { DEFAULT_COMPONENTS } from "@/constants/components";
import { FlowHeader } from "./FlowSidebar/FlowHeader";
import { ComponentList } from "./FlowSidebar/ComponentList";
import { ComponentItem } from "@/types";
import FlowActions from "../FlowActions/FlowActions";
import { FlowInfo } from "./FlowSidebar/FlowInfo";
import { useFlowStore } from "@/store/flowStore";
import { useFlowNodes } from "@/hooks/useFlowNodes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { NodeConfigModal } from "./FlowSidebar/NodeConfigModal";

export default function FlowSidebar() {
  const { currentFlow } = useFlowStore();
  const {
    handleComponentClick,
    isModalOpen,
    setIsModalOpen,
    selectedComponent,
    nodeConfig,
    setNodeConfig,
    handleCreateNode,
  } = useFlowNodes();

  const getModalTitle = () => {
    switch (selectedComponent?.type) {
      case 'trigger':
        return 'Criar Gatilho';
      case 'action':
        return 'Criar Ação';
      case 'condition':
        return 'Criar Condição';
      default:
        return 'Criar Nó';
    }
  };

  const getModalDescription = () => {
    switch (selectedComponent?.type) {
      case 'trigger':
        return 'Adicione um gatilho para iniciar ou finalizar o fluxo';
      case 'action':
        return 'Adicione uma ação para executar no fluxo';
      case 'condition':
        return 'Adicione uma condição para controlar o fluxo';
      default:
        return 'Adicione um novo nó ao fluxo';
    }
  };

  return (
    <>
      <Card className="w-[300px] min-h-screen rounded-none border-r shadow-none">
        <CardContent className="p-4 flex flex-col gap-4">
          <FlowHeader />
          <FlowActions />
          <FlowInfo flowName={currentFlow.attributes.name} flowId={currentFlow.id} />
          <Separator />
          <ComponentList
            components={DEFAULT_COMPONENTS}
            onComponentClick={handleComponentClick}
          />
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{getModalTitle()}</DialogTitle>
            <DialogDescription>{getModalDescription()}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <NodeConfigModal
              selectedComponent={selectedComponent}
              nodeConfig={nodeConfig}
              setNodeConfig={setNodeConfig}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateNode}>
              Criar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 