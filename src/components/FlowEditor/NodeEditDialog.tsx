import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import { TriggerForm, ConditionForm, WebhookForm, ActionForm, DelayForm } from "./NodeTypeForms";

interface NodeEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  nodeId: string | null;
  initialLabel: string;
  nodeType: string;
  initialData?: any;
  onSave: (nodeId: string, data: any) => void;
  onEditClick?: (nodeId: string, label: string) => void;
  previousNode?: any | null;
}

export function NodeEditDialog({
  isOpen,
  onOpenChange,
  nodeId,
  initialLabel,
  nodeType,
  initialData = {},
  onSave,
  onEditClick,
  previousNode,
}: NodeEditDialogProps) {
  const [formData, setFormData] = useState(initialData);
  const [label, setLabel] = useState(initialLabel);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
      setLabel(initialLabel);
    }
  }, [isOpen, initialData, initialLabel]);
  
  const handleSave = useCallback(() => {
    if (nodeId) {
      const saveData = {
        ...formData,
        label: label,
        config: formData.config?.type === 'openai' ? {
          ...formData.config,
          credentials: formData.config?.credentials || '',
          baseScript: formData.config?.baseScript || ''
        } : formData.config
      };
      onSave(nodeId, saveData);
      onOpenChange(false);
    }
  }, [nodeId, label, formData, onSave, onOpenChange, nodeType]);

  const handleLabelChange = useCallback((value: string) => {
    setLabel(value);
  }, []);

  const handleFormDataChange = useCallback((newData: any) => {
    setFormData(prevData => {
      const updatedData = { ...prevData, ...newData };
      if (nodeType === 'action' && newData.config) {
        updatedData.config = {
          ...prevData.config,
          ...newData.config,
          credentials: newData.config.credentials || prevData.config?.credentials || '',
          baseScript: newData.config.baseScript || prevData.config?.baseScript || ''
        };
      }
      return updatedData;
    });
  }, [nodeType]);

  const renderForm = useCallback(() => {
    switch (nodeType) {
      case "trigger":
        return <TriggerForm label={label} onLabelChange={handleLabelChange} />;
      case "condition":
        return (
          <ConditionForm
            label={label}
            onLabelChange={handleLabelChange}
            firstValue={formData.firstValue || ""}
            operator={formData.operator || ""}
            secondValue={formData.secondValue || ""}
            firstValueType={formData.firstValueType || "value"}
            onFirstValueChange={(value) => handleFormDataChange({ firstValue: value })}
            onOperatorChange={(value) => handleFormDataChange({ operator: value })}
            onSecondValueChange={(value) => handleFormDataChange({ secondValue: value })}
            onFirstValueTypeChange={(value) => handleFormDataChange({ firstValueType: value })}
          />
        );
      case "webhook":
        return (
          <WebhookForm
            label={label}
            onLabelChange={handleLabelChange}
            url={formData.url || ""}
            config={formData.config || { method: "GET" }}
            params={formData.params || []}
            onUrlChange={(value) => handleFormDataChange({ url: value })}
            onConfigChange={(config) => handleFormDataChange({ config })}
            onParamsChange={(params) => handleFormDataChange({ params })}
          />
        );
      case "action":
        return (
          <ActionForm
            label={label}
            onLabelChange={handleLabelChange}
            type={formData.type || ""}
            config={formData.config || {}}
            onConfigChange={(config) => handleFormDataChange({ config })}
          />
        );
      case "delay":
        return (
          <DelayForm
            label={label}
            onLabelChange={handleLabelChange}
            config={formData.config || { seconds: 0 }}
            onConfigChange={(config) => handleFormDataChange({ config })}
          />
        );
      default:
        return null;
    }
  }, [nodeType, label, formData, handleLabelChange, handleFormDataChange]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Nó</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {renderForm()}
          
          <div className="border-t pt-4 mt-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Input</h3>
                <div className="bg-muted p-3 rounded-md">
                  {previousNode ? (
                    <p className="text-sm">Node anterior: {previousNode.data.label || previousNode.id}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhum node anterior conectado</p>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Output</h3>
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-sm text-muted-foreground">Execute o flow para ver o output.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 