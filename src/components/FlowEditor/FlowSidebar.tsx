import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { LightningBoltIcon, GearIcon, StopwatchIcon, GlobeIcon, MixerHorizontalIcon, PlusIcon } from "@radix-ui/react-icons";

export default function FlowSidebar() {
  return (
    <Card className="w-[260px] min-h-screen rounded-none border-r shadow-none">
      <CardContent className="p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-lg">Flows</span>
          <Button size="icon" variant="outline">
            <PlusIcon />
          </Button>
        </div>
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione um flow" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">21 dias de abundância de...</SelectItem>
            {/* Adicione outros flows dinamicamente */}
          </SelectContent>
        </Select>
        <Separator />
        <div>
          <span className="font-semibold text-base mb-2 block">Componentes</span>
          <ul className="space-y-2 mt-2">
            <li className="flex items-center gap-2"><LightningBoltIcon /> Gatilho</li>
            <li className="flex items-center gap-2"><GearIcon /> Ação</li>
            <li className="flex items-center gap-2"><MixerHorizontalIcon /> Condição</li>
            <li className="flex items-center gap-2"><StopwatchIcon /> Atraso</li>
            <li className="flex items-center gap-2"><GlobeIcon /> Webhook</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
} 