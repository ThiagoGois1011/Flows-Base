import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React from "react";
import { FlowHeader } from "../FlowEditor/FlowSidebar/FlowHeader";

export default function HomeSidebar() {
  const handleSelectFlow = () => {
    // Implementar lógica de seleção de flow
    console.log("Selecionar flow");
  };

  const handleCreateFlow = () => {
    // Implementar lógica de criação de flow
    console.log("Criar flow");
  };

  return (
    <Card className="w-[260px] min-h-screen rounded-none border-r shadow-none">
      <CardContent className="p-4 flex flex-col gap-4">
        <FlowHeader onAddFlow={handleCreateFlow} />
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleSelectFlow}
          >
            Selecione um Flow
          </Button>
          <Button 
            variant="default" 
            className="flex-1"
            onClick={handleCreateFlow}
          >
            Criar Flow
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 