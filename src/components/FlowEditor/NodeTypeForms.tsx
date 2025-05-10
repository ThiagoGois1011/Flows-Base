'use client';

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface BaseFormProps {
  label: string;
  onLabelChange: (value: string) => void;
}

interface ConditionFormProps extends BaseFormProps {
  firstValue: string;
  operator: string;
  secondValue: string;
  onFirstValueChange: (value: string) => void;
  onOperatorChange: (value: string) => void;
  onSecondValueChange: (value: string) => void;
}

interface WebhookFormProps extends BaseFormProps {
  url: string;
  params: { key: string; value: string }[];
  onUrlChange: (value: string) => void;
  onParamsChange: (params: { key: string; value: string }[]) => void;
}

interface ActionFormProps extends BaseFormProps {
  type: string;
  config: {
    action: string;
    phone?: string;
    response?: string;
  };
  onConfigChange: (config: any) => void;
}

export const TriggerForm: React.FC<BaseFormProps> = ({ label, onLabelChange }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Nome do Gatilho</Label>
        <Input
          value={label}
          onChange={(e) => onLabelChange(e.target.value)}
          placeholder="Nome do gatilho"
        />
      </div>
    </div>
  );
};

export const ConditionForm: React.FC<ConditionFormProps> = ({
  label,
  onLabelChange,
  firstValue,
  operator,
  secondValue,
  onFirstValueChange,
  onOperatorChange,
  onSecondValueChange,
}) => {
  const [localFirstValue, setLocalFirstValue] = React.useState(firstValue);
  const [localSecondValue, setLocalSecondValue] = React.useState(secondValue);

  React.useEffect(() => {
    setLocalFirstValue(firstValue);
    setLocalSecondValue(secondValue);
  }, [firstValue, secondValue]);

  const handleFirstValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalFirstValue(newValue);
    onFirstValueChange(newValue);
  };

  const handleSecondValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalSecondValue(newValue);
    onSecondValueChange(newValue);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Nome da Condição</Label>
        <Input
          value={label}
          onChange={(e) => onLabelChange(e.target.value)}
          placeholder="Nome da condição"
        />
      </div>
      <div className="space-y-2">
        <Label>Primeiro Valor</Label>
        <Input
          value={localFirstValue}
          onChange={handleFirstValueChange}
          placeholder="Primeiro valor"
        />
      </div>
      <div className="space-y-2">
        <Label>Operador</Label>
        <Select value={operator} onValueChange={onOperatorChange}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione um operador" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="==">Igual a (==)</SelectItem>
            <SelectItem value="!=">Diferente de (!=)</SelectItem>
            <SelectItem value=">">Maior que (&gt;)</SelectItem>
            <SelectItem value="<">Menor que (&lt;)</SelectItem>
            <SelectItem value=">=">Maior ou igual (&gt;=)</SelectItem>
            <SelectItem value="<=">Menor ou igual (&lt;=)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Segundo Valor</Label>
        <Input
          value={localSecondValue}
          onChange={handleSecondValueChange}
          placeholder="Segundo valor"
        />
      </div>
    </div>
  );
};

export const WebhookForm: React.FC<WebhookFormProps> = ({
  label,
  onLabelChange,
  url,
  params,
  onUrlChange,
  onParamsChange,
}) => {
  const [localUrl, setLocalUrl] = React.useState(url);
  const [localParams, setLocalParams] = React.useState(params);

  React.useEffect(() => {
    setLocalUrl(url);
    setLocalParams(params);
  }, [url, params]);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalUrl(newValue);
    onUrlChange(newValue);
  };

  const handleParamChange = (index: number, field: 'key' | 'value', value: string) => {
    const newParams = [...localParams];
    newParams[index] = { ...newParams[index], [field]: value };
    setLocalParams(newParams);
    onParamsChange(newParams);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Nome do Webhook</Label>
        <Input
          value={label}
          onChange={(e) => onLabelChange(e.target.value)}
          placeholder="Nome do webhook"
        />
      </div>
      <div className="space-y-2">
        <Label>URL</Label>
        <Input
          value={localUrl}
          onChange={handleUrlChange}
          placeholder="https://exemplo.com/webhook"
        />
      </div>
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label>Chave {index + 1}</Label>
            <Input
              value={localParams[index]?.key || ''}
              onChange={(e) => handleParamChange(index, 'key', e.target.value)}
              placeholder="Nome do parâmetro"
            />
          </div>
          <div className="space-y-2">
            <Label>Valor {index + 1}</Label>
            <Input
              value={localParams[index]?.value || ''}
              onChange={(e) => handleParamChange(index, 'value', e.target.value)}
              placeholder="Valor do parâmetro"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export const ActionForm: React.FC<ActionFormProps> = ({
  label,
  onLabelChange,
  type,
  config,
  onConfigChange,
}) => {
  const [localConfig, setLocalConfig] = React.useState(config);

  React.useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  const handleConfigChange = (newConfig: any) => {
    setLocalConfig(newConfig);
    onConfigChange(newConfig);
  };

  if (type === 'whatsapp') {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Nome da Ação</Label>
          <Input
            value={label}
            onChange={(e) => onLabelChange(e.target.value)}
            placeholder="Nome da ação"
          />
        </div>
        <div className="space-y-2">
          <Label>Telefone</Label>
          <Input
            value={localConfig.phone || ''}
            onChange={(e) => handleConfigChange({ ...localConfig, phone: e.target.value })}
            placeholder="+5511999999999"
          />
        </div>
        {localConfig.action === 'send_message' && (
          <div className="space-y-2">
            <Label>Mensagem</Label>
            <Input
              value={localConfig.response || ''}
              onChange={(e) => handleConfigChange({ ...localConfig, response: e.target.value })}
              placeholder="Digite a mensagem"
            />
          </div>
        )}
      </div>
    );
  }

  if (type === 'openai') {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Nome da Ação</Label>
          <Input
            value={label}
            onChange={(e) => onLabelChange(e.target.value)}
            placeholder="Nome da ação"
          />
        </div>
      </div>
    );
  }

  return null;
}; 