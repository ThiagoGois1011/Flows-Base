import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LightningBoltIcon, GearIcon, StopwatchIcon, GlobeIcon, MixerHorizontalIcon, PlusIcon, ArrowLeftIcon } from "@radix-ui/react-icons";
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

interface FlowSidebarProps {
  onNodeCreated: (nodeId: string, label: string) => void;
}

export default function FlowSidebar({ onNodeCreated }: FlowSidebarProps) {
  const { currentFlow } = useFlowStore();
  const [currentStep, setCurrentStep] = React.useState(1);
  const {
    handleComponentClick,
    isModalOpen,
    setIsModalOpen,
    selectedComponent,
    nodeConfig,
    setNodeConfig,
    handleCreateNode,
    getNodeLabel,
  } = useFlowNodes();

  const getModalTitle = () => {
    switch (selectedComponent?.type) {
      case 'trigger':
        return 'Criar Gatilho';
      case 'action':
        if (currentStep === 1) {
          return 'Selecione o tipo de ação';
        }
        if (nodeConfig.type === 'whatsapp') {
          return 'Selecione a ação do WhatsApp';
        }
        if (nodeConfig.type === 'openai') {
          return 'Selecione a ferramenta OpenAI';
        }
        return 'Criar Ação';
      case 'condition':
        return 'Configure a condição';
      default:
        return 'Criar Nó';
    }
  };

  const getModalDescription = () => {
    switch (selectedComponent?.type) {
      case 'trigger':
        return 'Adicione um gatilho para iniciar ou finalizar o fluxo';
      case 'action':
        if (currentStep === 1) {
          return 'Escolha o tipo de ação que deseja adicionar';
        }
        if (nodeConfig.type === 'whatsapp') {
          return 'Escolha a ação do WhatsApp que deseja executar';
        }
        if (nodeConfig.type === 'openai') {
          return 'Escolha a ferramenta OpenAI que deseja utilizar';
        }
        return 'Adicione uma ação para executar no fluxo';
      case 'condition':
        return 'Adicione uma condição para controlar o fluxo';
      default:
        return 'Adicione um novo nó ao fluxo';
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      setIsModalOpen(false);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setIsModalOpen(false);
  };

  const handleNodeCreated = (nodeId: string, label: string) => {
    onNodeCreated(nodeId, label);
    handleClose();
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

      <Dialog open={isModalOpen} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeftIcon className="h-4 w-4" />
              </Button>
              <div>
                <DialogTitle>{getModalTitle()}</DialogTitle>
                <DialogDescription>{getModalDescription()}</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="py-4">
            <NodeConfigModal
              selectedComponent={selectedComponent}
              nodeConfig={nodeConfig}
              setNodeConfig={setNodeConfig}
              onClose={handleClose}
              onCreateNode={handleCreateNode}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              onNodeCreated={handleNodeCreated}
              getNodeLabel={getNodeLabel}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 