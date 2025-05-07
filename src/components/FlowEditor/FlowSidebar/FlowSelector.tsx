import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Flow } from "@/types";

interface FlowSelectorProps {
  flows: Flow[];
  selectedFlow: string;
  onFlowChange: (value: string) => void;
}

export const FlowSelector: React.FC<FlowSelectorProps> = ({
  flows,
  selectedFlow,
  onFlowChange,
}) => (
  <Select value={selectedFlow} onValueChange={onFlowChange}>
    <SelectTrigger className="w-full">
      <SelectValue placeholder="Selecione um flow" />
    </SelectTrigger>
    <SelectContent>
      {flows.map((flow) => (
        <SelectItem key={flow.id} value={flow.id}>
          {flow.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
); 