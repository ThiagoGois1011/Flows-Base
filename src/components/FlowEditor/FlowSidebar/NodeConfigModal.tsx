import React from "react";
import { ComponentItem, NodeConfig } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface NodeConfigModalProps {
  selectedComponent: ComponentItem | null;
  nodeConfig: NodeConfig;
  setNodeConfig: (config: NodeConfig) => void;
}

export const NodeConfigModal: React.FC<NodeConfigModalProps> = ({
  selectedComponent,
  nodeConfig,
  setNodeConfig,
}) => {
  if (!selectedComponent) return null;

  switch (selectedComponent.type) {
    case 'trigger':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo de Gatilho</label>
            <Select
              value={nodeConfig.triggerType}
              onValueChange={(value: 'init' | 'end') => setNodeConfig({ type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="init">Início</SelectItem>
                <SelectItem value="end">Fim</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );

    case 'action':
      if (!nodeConfig.actionType) {
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Ação</label>
              <Select
                value={nodeConfig.actionType}
                onValueChange={(value: 'whatsapp' | 'openai') => setNodeConfig({ type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="openai">OpenAI</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      }

      if (nodeConfig.actionType === 'whatsapp') {
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Ação do WhatsApp</label>
              <Select
                value={nodeConfig.whatsappAction || ''}
                onValueChange={(value: 'receive_message' | 'send_message') => 
                  setNodeConfig((config) => ({ ...config, config: { action: value } }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a ação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="receive_message">Receber Mensagem</SelectItem>
                  <SelectItem value="send_message">Enviar Mensagem</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      }

      if (nodeConfig.actionType === 'openai') {
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Modelo</label>
              <Select
                value={nodeConfig.openaiConfig?.model || ''}
                onValueChange={(value) => 
                  setNodeConfig((config) => ({ ...config, config: { ...config.config, model: value } }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o modelo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Banco de Dados</label>
              <Select
                value={nodeConfig.openaiConfig?.database}
                onValueChange={(value: 'redis' | 'mysql') => 
                  setNodeConfig((config) => ({ ...config, config: { ...config.config, database: value } }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o banco" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="redis">Redis</SelectItem>
                  <SelectItem value="mysql">MySQL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Ferramenta</label>
              <Select
                value={nodeConfig.openaiConfig?.tool}
                onValueChange={(value: 'create_assistant' | 'text_response' | 'audio_response') => 
                  setNodeConfig((config) => ({ ...config, config: { ...config.config, action: value } }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a ferramenta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="create_assistant">Criar Assistente</SelectItem>
                  <SelectItem value="text_response">Responder com Texto</SelectItem>
                  <SelectItem value="audio_response">Responder com Áudio</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      }
      break;

    case 'condition':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Condição</label>
            <Input
              value={nodeConfig.conditionConfig?.condition || ''}
              onChange={(e) => 
                setNodeConfig((config) => ({ config: { ...config.config }}))}
              placeholder="Digite a condição"
            />
          </div>
        </div>
      );
  }

  return null;
};