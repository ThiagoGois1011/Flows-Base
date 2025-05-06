import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ReloadIcon, PlayIcon, DownloadIcon, CounterClockwiseClockIcon } from "@radix-ui/react-icons";

export default function FlowTopbar() {
  return (
    <div className="flex items-center justify-between px-6 py-2 border-b bg-white/80 backdrop-blur z-10">
      <div className="flex items-center gap-2">
        <Button size="icon" variant="ghost"><DownloadIcon /></Button>
        <Button size="icon" variant="ghost"><ReloadIcon /></Button>
        <Button size="icon" variant="ghost"><CounterClockwiseClockIcon /></Button>
      </div>
      <div className="text-sm text-muted-foreground">
        Última atualização: 02/05/2025 às 11:01
      </div>
      <Button size="icon" className="bg-primary text-white"><PlayIcon /></Button>
    </div>
  );
} 