"use client";
import React from "react";
import { useFlowStore } from "@/store/flowStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ReloadIcon, PlayIcon, DownloadIcon, CounterClockwiseClockIcon, SaveIcon } from "@radix-ui/react-icons";

export default function FlowTopbar() {
  const { currentFlow, updateFlow } = useFlowStore();

  const handleSave = () => {
    if (!currentFlow) return;
    updateFlow(currentFlow);
  };

  return (
    <div className="flex items-center justify-between px-6 py-2 border-b bg-white/80 backdrop-blur z-10">
      <div className="flex items-center gap-2">
        <Button size="icon" variant="ghost"><DownloadIcon /></Button>
        <Button size="icon" variant="ghost"><ReloadIcon /></Button>
        <Button size="icon" variant="ghost"><CounterClockwiseClockIcon /></Button>
      </div>
      <div className="text-sm text-muted-foreground">
        Última atualização: {currentFlow?.attributes.updatedAt ? new Date(currentFlow.attributes.updatedAt).toLocaleString() : 'Nunca'}
      </div>
      <Button size="icon" className="bg-primary text-white"><PlayIcon /></Button>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
          className="flex items-center space-x-2"
        >
          
          <span>Salvar</span>
        </Button>
      </div>
    </div>
  );
} 