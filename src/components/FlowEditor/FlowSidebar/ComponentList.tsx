import { ComponentItem } from "@/types";

interface ComponentListProps {
  components: ComponentItem[];
  onComponentClick: (component: ComponentItem) => void;
}

export const ComponentList: React.FC<ComponentListProps> = ({
  components,
  onComponentClick,
}) => (
  <div>
    <span className="font-semibold text-base mb-2 block">Componentes</span>
    <ul className="space-y-2 mt-2">
      {components.map((component) => (
        <li
          key={component.id}
          className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
          onClick={() => onComponentClick(component)}
        >
          {component.icon} {component.name}
        </li>
      ))}
    </ul>
  </div>
); 