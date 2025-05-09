import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LightningBoltIcon, GearIcon, StopwatchIcon, GlobeIcon, MixerHorizontalIcon, PlusIcon } from "@radix-ui/react-icons";
import React from "react";
import { DEFAULT_COMPONENTS } from "@/constants/components";
import { FlowHeader } from "./FlowSidebar/FlowHeader";
import { ComponentList } from "./FlowSidebar/ComponentList";
import { ComponentItem, Flow } from "@/types";
import FlowActions from "../FlowActions/FlowActions";
import { FlowInfo } from "./FlowSidebar/FlowInfo";
import { useParams } from "next/navigation";
import { useFlows } from "@/contexts/FlowContext";

interface FlowSidebarProps {
  onComponentClick: (component: ComponentItem) => void;
  flow: Flow;
}

export default function FlowSidebar({ onComponentClick, flow }: FlowSidebarProps) {
  const { flows, selectedFlow, addFlow, selectFlow } = useFlows();

  const handleComponentClick = (component: ComponentItem) => {
    // Implementar lógica de seleção de componente
    console.log("Componente selecionado:", component);
  };

  
  return (
    <Card className="w-[300px] min-h-screen rounded-none border-r shadow-none">
      <CardContent className="p-4 flex flex-col gap-4">
        <FlowHeader />
        <FlowActions />
        <FlowInfo flowName={flow.attributes.name} flowId={flow.id} />
        <Separator />
        <ComponentList
          components={DEFAULT_COMPONENTS}
          onComponentClick={onComponentClick}
        />
      </CardContent>
    </Card>
  );
} 