import { LightningBoltIcon, GearIcon, StopwatchIcon, GlobeIcon, MixerHorizontalIcon } from "@radix-ui/react-icons";
import { ComponentItem } from '@/types';

export const DEFAULT_COMPONENTS: ComponentItem[] = [
  {
    id: 'trigger',
    name: 'Gatilho',
    icon: <LightningBoltIcon />,
    description: 'Inicia o fluxo quando uma condição é atendida',
    category: 'trigger',
  },
  {
    id: 'action',
    name: 'Ação',
    icon: <GearIcon />,
    description: 'Executa uma ação específica',
    category: 'action',
  },
  {
    id: 'condition',
    name: 'Condição',
    icon: <MixerHorizontalIcon />,
    description: 'Define uma condição para o fluxo',
    category: 'condition',
  },
  {
    id: 'delay',
    name: 'Atraso',
    icon: <StopwatchIcon />,
    description: 'Adiciona um atraso no fluxo',
    category: 'delay',
  },
  {
    id: 'webhook',
    name: 'Webhook',
    icon: <GlobeIcon />,
    description: 'Integra com serviços externos',
    category: 'webhook',
  },
]; 