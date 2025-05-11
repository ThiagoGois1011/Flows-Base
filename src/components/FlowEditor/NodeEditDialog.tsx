import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import { TriggerForm, ConditionForm, WebhookForm, ActionForm } from "./NodeTypeForms";

interface NodeEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  nodeId: string | null;
  initialLabel: string;
  nodeType: string;
  initialData?: any;
  onSave: (nodeId: string, data: any) => void;
}

export function NodeEditDialog({
  isOpen,
  onOpenChange,
  nodeId,
  initialLabel,
  nodeType,
  initialData = {},
  onSave,
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
        config: {
          ...formData.config,
          credentials: formData.config?.credentials || '',
          baseScript: formData.config?.baseScript || ''
        }
      };
      onSave(nodeId, saveData);
      onOpenChange(false);
    }
  }, [nodeId, label, formData, onSave, onOpenChange]);

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
            onFirstValueChange={(value) => handleFormDataChange({ firstValue: value })}
            onOperatorChange={(value) => handleFormDataChange({ operator: value })}
            onSecondValueChange={(value) => handleFormDataChange({ secondValue: value })}
          />
        );
      case "webhook":
        return (
          <WebhookForm
            label={label}
            onLabelChange={handleLabelChange}
            url={formData.url || ""}
            params={formData.params || []}
            onUrlChange={(value) => handleFormDataChange({ url: value })}
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