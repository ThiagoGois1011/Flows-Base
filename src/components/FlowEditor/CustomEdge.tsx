import { BaseEdge, EdgeProps, getBezierPath } from 'reactflow';
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@radix-ui/react-icons";
import { useState, useCallback } from "react";

export function CustomEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  id,
  onDelete,
}: EdgeProps & { onDelete?: (edgeId: string) => void }) {
  const [isHovered, setIsHovered] = useState(false);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleDelete = useCallback(() => {
    if (onDelete) {
      onDelete(id);
    }
  }, [onDelete, id]);

  return (
    <g
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: 'pointer' }}
    >
      {/* Área invisível maior para capturar eventos do mouse */}
      <path
        d={edgePath}
        style={{
          stroke: 'transparent',
          strokeWidth: 30,
          cursor: 'pointer',
        }}
        fill="none"
      />
      {/* Edge visual fina */}
      <path
        d={edgePath}
        style={{
          ...style,
          stroke: '#b1b1b7',
          strokeWidth: 2,
        }}
        fill="none"
        markerEnd={markerEnd}
      />
      {isHovered && (
        <foreignObject
          x={labelX - 20}
          y={labelY - 20}
          width={40}
          height={40}
          className="flex items-center justify-center pointer-events-none"
          style={{ overflow: 'visible' }}
        >
          <div className="pointer-events-auto">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-white shadow-md hover:bg-destructive hover:text-white transition-colors duration-200"
              onClick={handleDelete}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        </foreignObject>
      )}
    </g>
  );
} 