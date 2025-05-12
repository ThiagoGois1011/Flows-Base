import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface BaseFormProps {
  label: string;
  onLabelChange: (value: string) => void;
  children?: React.ReactNode;
  labelPlaceholder?: string;
}

export function BaseForm({
  label,
  onLabelChange,
  children,
  labelPlaceholder = "Nome"
}: BaseFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Nome</Label>
        <Input
          value={label}
          onChange={(e) => onLabelChange(e.target.value)}
          placeholder={labelPlaceholder}
        />
      </div>
      {children}
    </div>
  );
} 