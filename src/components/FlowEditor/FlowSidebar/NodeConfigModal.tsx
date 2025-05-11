import React from "react";
import { ComponentItem, NodeConfig } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatBubbleIcon, EnvelopeClosedIcon, GlobeIcon, LightningBoltIcon, MixerHorizontalIcon, PlusIcon, StopwatchIcon, LayersIcon, StackIcon } from "@radix-ui/react-icons";

const OPENAI_MODELS = [
  { id: 'gpt-4', name: 'GPT-4', description: 'Modelo mais avançado para tarefas complexas' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Modelo rápido e eficiente' },
  { id: 'gpt-3.5-turbo-16k', name: 'GPT-3.5 Turbo 16K', description: 'Modelo com contexto expandido' },
];

const DATABASE_OPTIONS = [
  { id: 'mysql', name: 'MySQL', description: 'Banco de dados relacional' },
  { id: 'redis', name: 'Redis', description: 'Banco de dados em memória' },
];

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
        <div className="grid grid-cols-1 gap-4">
          <Button
            variant="outline"
            className="flex items-center justify-start gap-2 h-auto p-4"
            onClick={() => {
              setNodeConfig({ type: 'whatsapp' });
              setCurrentStep(2);
            }}
          >
            <div className="flex flex-col items-start">
              <span className="font-medium">WhatsApp</span>
              <span className="text-sm text-muted-foreground">
                Envie mensagens e interaja com o WhatsApp
              </span>
            </div>
          </Button>
          <Button
            variant="outline"
            className="flex items-center justify-start gap-2 h-auto p-4"
            onClick={() => {
              setNodeConfig({ type: 'openai' });
              setCurrentStep(2);
            }}
          >
            <div className="flex flex-col items-start">
              <span className="font-medium">OpenAI</span>
              <span className="text-sm text-muted-foreground">
                Utilize modelos de IA da OpenAI
              </span>
            </div>
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

    if (currentStep === 3 && nodeConfig.type === 'openai') {
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

    if (currentStep === 4 && nodeConfig.type === 'openai') {
      return (
        <div className="grid grid-cols-1 gap-4">
          <Button
            variant="outline"
            className="flex items-center justify-start gap-2 h-auto p-4"
            onClick={() => {
              handleCreateNodeWithConfig({
                ...nodeConfig,
                config: { 
                  action: 'response_with_text',
                  model: nodeConfig.model,
                  database: nodeConfig.database
                }
              });
            }}
          >
            <div className="flex flex-col items-start">
              <span className="font-medium">Responder com Texto</span>
              <span className="text-sm text-muted-foreground">
                Gere uma resposta em formato de texto
              </span>
            </div>
          </Button>
          <Button
            variant="outline"
            className="flex items-center justify-start gap-2 h-auto p-4"
            onClick={() => {
              handleCreateNodeWithConfig({
                ...nodeConfig,
                config: { 
                  action: 'response_with_audio',
                  model: nodeConfig.model,
                  database: nodeConfig.database
                }
              });
            }}
          >
            <div className="flex flex-col items-start">
              <span className="font-medium">Responder com Áudio</span>
              <span className="text-sm text-muted-foreground">
                Gere uma resposta em formato de áudio
              </span>
            </div>
          </Button>
          <Button
            variant="outline"
            className="flex items-center justify-start gap-2 h-auto p-4"
            onClick={() => {
              handleCreateNodeWithConfig({
                ...nodeConfig,
                config: { 
                  action: 'generate_image',
                  model: nodeConfig.model,
                  database: nodeConfig.database
                }
              });
            }}
          >
            <div className="flex flex-col items-start">
              <span className="font-medium">Gerar Imagem</span>
              <span className="text-sm text-muted-foreground">
                Gere uma imagem a partir de uma descrição
              </span>
            </div>
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