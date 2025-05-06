import { getFlowById } from "@/lib/api";
import FlowEditor from "@/components/FlowEditor/FlowEditor";

interface FlowEditProps {
  params: { id: string };
}

export default async function FlowEdit({ params }: FlowEditProps) {
  const flow = await getFlowById(params.id);
  if (!flow) return <div>Carregando...</div>;
  return <FlowEditor flow={flow} />;
} 