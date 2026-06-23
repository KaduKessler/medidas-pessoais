import { Footprints, Ruler } from 'lucide-react';

export interface MedidaCampo {
  chave: 'busto' | 'torax' | 'cintura' | 'quadril' | 'coxa' | 'calcado';
  label: string;
  labelCurto: string;
  unidade: string;
  icon: typeof Ruler;
  cor: string;
}

export const MEDIDA_CAMPOS: MedidaCampo[] = [
  {
    chave: 'busto',
    label: 'Busto (cm)',
    labelCurto: 'Busto',
    unidade: 'cm',
    icon: Ruler,
    cor: '#6366f1',
  },
  {
    chave: 'torax',
    label: 'Tórax (cm)',
    labelCurto: 'Tórax',
    unidade: 'cm',
    icon: Ruler,
    cor: '#8b5cf6',
  },
  {
    chave: 'cintura',
    label: 'Cintura (cm)',
    labelCurto: 'Cintura',
    unidade: 'cm',
    icon: Ruler,
    cor: '#ec4899',
  },
  {
    chave: 'quadril',
    label: 'Quadril (cm)',
    labelCurto: 'Quadril',
    unidade: 'cm',
    icon: Ruler,
    cor: '#f59e0b',
  },
  {
    chave: 'coxa',
    label: 'Coxa (cm)',
    labelCurto: 'Coxa',
    unidade: 'cm',
    icon: Ruler,
    cor: '#10b981',
  },
  {
    chave: 'calcado',
    label: 'Calçado (BR)',
    labelCurto: 'Calçado',
    unidade: 'BR',
    icon: Footprints,
    cor: '#3b82f6',
  },
];
