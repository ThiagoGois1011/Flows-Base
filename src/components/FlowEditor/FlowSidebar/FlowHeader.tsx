import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";

interface FlowHeaderProps {
  onAddFlow: () => void;
}

export const FlowHeader: React.FC<FlowHeaderProps> = ({ onAddFlow }) => (
  <div className="flex items-center justify-between mb-2">
    <span className="font-bold text-lg">Flows</span>
    <Button size="icon" variant="outline" onClick={onAddFlow}>
      <PlusIcon />
    </Button>
  </div>
); 