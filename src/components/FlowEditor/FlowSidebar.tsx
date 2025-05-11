import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  LightningBoltIcon, 
  GearIcon, 
  StopwatchIcon, 
  GlobeIcon, 
  MixerHorizontalIcon, 
  PlusIcon, 
  ArrowLeftIcon,
  LayersIcon,
  StackIcon
} from "@radix-ui/react-icons";
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
  onNodeCreated: (nodeId: string, label: string, type: string, data: any) => void;
}

const OPENAI_MODELS = [
  { id: 'gpt-4', name: 'GPT-4', description: 'Modelo mais avançado para tarefas complexas' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Modelo rápido e eficiente' },
  { id: 'gpt-3.5-turbo-16k', name: 'GPT-3.5 Turbo 16K', description: 'Modelo com contexto expandido' },
];

const DATABASE_OPTIONS = [
  { id: 'mysql', name: 'MySQL', description: 'Banco de dados relacional' },
  { id: 'redis', name: 'Redis', description: 'Banco de dados em memória' },
];

export default function FlowSidebar({ onNodeCreated }: FlowSidebarProps) {
  const { 
    currentFlow, 
    currentStep, 
    setCurrentStep,
    isModalOpen,
    selectedComponent,
    nodeConfig,
    setModalOpen,
    setNodeConfig
  } = useFlowStore();

  const {
    handleComponentClick,
    handleCreateNode,
    getNodeLabel,
  } = useFlowNodes();

  const handleComponentClickWrapper = (component: ComponentItem) => {
    const directCreateComponents = ['delay', 'condition', 'webhook'];
    
    if (directCreateComponents.includes(component.type)) {
      let initialConfig = {};
      
      if (component.type === 'delay') {
        initialConfig = { config: { seconds: 0 } };
      } else if (component.type === 'webhook') {
        initialConfig = { config: { method: 'GET' } };
      }
      
      const nodeId = handleCreateNode(component, initialConfig);
      if (nodeId) {
        const label = getNodeLabel(component.type, initialConfig);
        onNodeCreated(nodeId, label, component.type, { type: component.type });
      }
      return;
    }

    handleComponentClick(component);
  };

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
          if (currentStep === 2) {
            return 'Selecione o modelo OpenAI';
          }
          if (currentStep === 3) {
            return 'Selecione o banco de dados';
          }
          return 'Configure a ação OpenAI';
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
          if (currentStep === 2) {
            return 'Escolha o modelo OpenAI que deseja utilizar';
          }
          if (currentStep === 3) {
            return 'Escolha o banco de dados para armazenar os dados';
          }
          return 'Configure a ação OpenAI';
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
      setModalOpen(false);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setModalOpen(false);
  };

  const handleNodeCreated = (nodeId: string, label: string, type: string, data: any) => {
    onNodeCreated(nodeId, label, type, data);
    handleClose();
  };

  const renderOpenAIConfig = () => {
    if (currentStep === 2) {
      return (
        <div className="grid grid-cols-1 gap-4">
          {OPENAI_MODELS.map((model) => (
            <Button
              key={model.id}
              variant="outline"
              className="flex items-center justify-start gap-2 h-auto p-4"
              onClick={() => {
                setNodeConfig({ ...nodeConfig, model: model.id });
                setCurrentStep(3);
              }}
            >
              <LayersIcon className="h-5 w-5" />
              <div className="flex flex-col items-start">
                <span className="font-medium">{model.name}</span>
                <span className="text-sm text-muted-foreground">{model.description}</span>
              </div>
            </Button>
          ))}
        </div>
      );
    }

    if (currentStep === 3) {
      return (
        <div className="grid grid-cols-1 gap-4">
          {DATABASE_OPTIONS.map((db) => (
            <Button
              key={db.id}
              variant="outline"
              className="flex items-center justify-start gap-2 h-auto p-4"
              onClick={() => {
                setNodeConfig({ ...nodeConfig, database: db.id });
                setCurrentStep(4);
              }}
            >
              <StackIcon className="h-5 w-5" />
              <div className="flex flex-col items-start">
                <span className="font-medium">{db.name}</span>
                <span className="text-sm text-muted-foreground">{db.description}</span>
              </div>
            </Button>
          ))}
        </div>
      );
    }

    return null;
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
            onComponentClick={handleComponentClickWrapper}
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