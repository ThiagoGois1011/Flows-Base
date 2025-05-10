import { LightningBoltIcon, GearIcon, StopwatchIcon, GlobeIcon, MixerHorizontalIcon } from "@radix-ui/react-icons";
import { ComponentItem } from '@/types';

export const DEFAULT_COMPONENTS: ComponentItem[] = [
  {
    id: 'trigger',
    name: 'Gatilho',
    icon: <LightningBoltIcon />,
    description: 'Inicia o fluxo quando uma condição é atendida',
    type: 'trigger',
  },
  {
    id: 'action',
    name: 'Ação',
    icon: <GearIcon />,
    description: 'Executa uma ação específica',
    type: 'action',
  },
  {
    id: 'condition',
    name: 'Condição',
    icon: <MixerHorizontalIcon />,
    description: 'Define uma condição para o fluxo',
    type: 'condition',
  },
  {
    id: 'delay',
    name: 'Atraso',
    icon: <StopwatchIcon />,
    description: 'Adiciona um atraso no fluxo',
    type: 'delay',
  },
  {
    id: 'webhook',
    name: 'Webhook',
    icon: <GlobeIcon />,
    description: 'Integra com serviços externos',
    type: 'webhook',
  },
]; 