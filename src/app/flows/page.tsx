import { getFlows } from "@/lib/api";

export default async function FlowsList() {
  const flows = await getFlows();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Flows</h1>
      <ul className="space-y-2">
        {flows && flows.data && flows.data.map((flow: any) => (
          <li key={flow.id}>
            <a className="text-blue-600 underline" href={`/flows/${flow.id}`}>{flow.attributes?.name || `Flow ${flow.id}`}</a>
          </li>
        ))}
      </ul>
    </div>
  );
} 