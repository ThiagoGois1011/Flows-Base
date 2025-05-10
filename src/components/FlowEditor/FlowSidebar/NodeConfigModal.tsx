import React from "react";
import { ComponentItem, NodeConfig } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatBubbleIcon, EnvelopeClosedIcon, GlobeIcon, LightningBoltIcon, MixerHorizontalIcon, PlusIcon, StopwatchIcon } from "@radix-ui/react-icons";

interface NodeConfigModalProps {
  selectedComponent: ComponentItem | null;
  nodeConfig: NodeConfig;
  setNodeConfig: (config: NodeConfig) => void;
  onClose: () => void;
  onCreateNode: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  onNodeCreated: (nodeId: string, label: string, type: string, data: any) => void;
  getNodeLabel: (type: string, config: NodeConfig) => string;
}

export const NodeConfigModal: React.FC<NodeConfigModalProps> = ({
  selectedComponent,
  nodeConfig,
  setNodeConfig,
  onClose,
  onCreateNode,
  currentStep,
  setCurrentStep,
  onNodeCreated,
  getNodeLabel,
}) => {
  const [shouldCreateNode, setShouldCreateNode] = React.useState(false);

  React.useEffect(() => {
    if (shouldCreateNode) {
      const nodeId = onCreateNode();
      if (nodeId && selectedComponent?.type) {
        const label = getNodeLabel(selectedComponent.type, nodeConfig);
        onNodeCreated(nodeId, label, selectedComponent.type, nodeConfig);
      }
      setShouldCreateNode(false);
    }
  }, [nodeConfig, shouldCreateNode, onCreateNode, selectedComponent, onNodeCreated, getNodeLabel]);

  if (!selectedComponent) return null;

  const handleCreateNodeWithConfig = (config: NodeConfig) => {
    setNodeConfig(config);
    setShouldCreateNode(true);
  };

  const renderTriggerOptions = () => (
    <div className="grid gap-2">
      <Button
        variant="outline"
        className="justify-start gap-2"
        onClick={() => {
          handleCreateNodeWithConfig({ type: 'init' });
        }}
      >
        <LightningBoltIcon className="h-4 w-4" />
        Início do Fluxo
      </Button>
      <Button
        variant="outline"
        className="justify-start gap-2"
        onClick={() => {
          handleCreateNodeWithConfig({ type: 'end' });
        }}
      >
        <StopwatchIcon className="h-4 w-4" />
        Fim do Fluxo
      </Button>
    </div>
  );

  const renderActionOptions = () => {
    if (currentStep === 1) {
      return (
        <div className="grid gap-2">
          <Button
            variant="outline"
            className="justify-start gap-2"
            onClick={() => {
              setNodeConfig({ type: 'whatsapp' });
              setCurrentStep(2);
            }}
          >
            <ChatBubbleIcon className="h-4 w-4" />
            WhatsApp
          </Button>
          <Button
            variant="outline"
            className="justify-start gap-2"
            onClick={() => {
              setNodeConfig({ type: 'openai' });
              setCurrentStep(2);
            }}
          >
            <GlobeIcon className="h-4 w-4" />
            OpenAI
          </Button>
        </div>
      );
    }

    if (currentStep === 2 && nodeConfig.type === 'whatsapp') {
      return (
        <div className="grid gap-2">
          <Button
            variant="outline"
            className="justify-start gap-2"
            onClick={() => {
              handleCreateNodeWithConfig({
                ...nodeConfig,
                config: { action: 'receive_message' }
              });
            }}
          >
            <EnvelopeClosedIcon className="h-4 w-4" />
            Receber Mensagem
          </Button>
          <Button
            variant="outline"
            className="justify-start gap-2"
            onClick={() => {
              handleCreateNodeWithConfig({
                ...nodeConfig,
                config: { action: 'send_message' }
              });
            }}
          >
            <ChatBubbleIcon className="h-4 w-4" />
            Enviar Mensagem
          </Button>
        </div>
      );
    }

    if (currentStep === 2 && nodeConfig.type === 'openai') {
      return (
        <div className="grid gap-2">
          <Button
            variant="outline"
            className="justify-start gap-2"
            onClick={() => {
              handleCreateNodeWithConfig({
                ...nodeConfig,
                config: { action: 'create_assistant' }
              });
            }}
          >
            <PlusIcon className="h-4 w-4" />
            Criar Assistente
          </Button>
          <Button
            variant="outline"
            className="justify-start gap-2"
            onClick={() => {
              handleCreateNodeWithConfig({
                ...nodeConfig,
                config: { action: 'text_response' }
              });
            }}
          >
            <ChatBubbleIcon className="h-4 w-4" />
            Responder com Texto
          </Button>
          <Button
            variant="outline"
            className="justify-start gap-2"
            onClick={() => {
              handleCreateNodeWithConfig({
                ...nodeConfig,
                config: { action: 'audio_response' }
              });
            }}
          >
            <MixerHorizontalIcon className="h-4 w-4" />
            Responder com Áudio
          </Button>
        </div>
      );
    }
  };

  const renderConditionOptions = () => (
    <div className="space-y-2">
      <Input
        value={nodeConfig.conditionConfig?.condition || ''}
        onChange={(e) => 
          setNodeConfig((config) => ({ ...config, config: { condition: e.target.value } }))}
        placeholder="Digite a condição"
      />
      <Button
        className="w-full mt-4"
        onClick={() => {
          handleCreateNodeWithConfig({
            ...nodeConfig,
            config: { condition: nodeConfig.conditionConfig?.condition || '' }
          });
        }}
      >
        Confirmar
      </Button>
    </div>
  );

  switch (selectedComponent.type) {
    case 'trigger':
      return renderTriggerOptions();
    case 'action':
      return renderActionOptions();
    case 'condition':
      return renderConditionOptions();
    default:
      return null;
  }
};