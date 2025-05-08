import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LightningBoltIcon, GearIcon, StopwatchIcon, GlobeIcon, MixerHorizontalIcon, PlusIcon } from "@radix-ui/react-icons";
import React from "react";
import { useFlow } from "@/hooks/useFlow";
import { DEFAULT_COMPONENTS } from "@/constants/components";
import { FlowHeader } from "./FlowSidebar/FlowHeader";
import { ComponentList } from "./FlowSidebar/ComponentList";
import { ComponentItem } from "@/types";

export default function FlowSidebar() {
  const { flows, selectedFlow, addFlow, selectFlow } = useFlow();

  const handleAddFlow = () => {
    addFlow({
      name: "Novo Flow",
      description: "Descrição do novo flow",
    });
  };

  const handleComponentClick = (component: ComponentItem) => {
    // Implementar lógica de seleção de componente
    console.log("Componente selecionado:", component);
  };

  return (
    <Card className="w-[300px] min-h-screen rounded-none border-r shadow-none">
      <CardContent className="p-4 flex flex-col gap-4">
        <FlowHeader onAddFlow={handleAddFlow} />
        <Separator />
        <ComponentList
          components={DEFAULT_COMPONENTS}
          onComponentClick={handleComponentClick}
        />
      </CardContent>
    </Card>
  );
} 