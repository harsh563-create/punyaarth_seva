import type { ImpactStat } from '@/types';

export const impactStats: ImpactStat[] = [
  {
    id: 'meals',
    label: { en: 'Meals Served', hi: 'भोजन परोसा गया' },
    value: 500,
    suffix: '+',
    icon: 'utensils',
  },
  {
    id: 'volunteers',
    label: { en: 'Volunteers', hi: 'स्वयंसेवक' },
    value: 200,
    suffix: '+',
    icon: 'users',
  },
  {
    id: 'activities',
    label: { en: 'Seva Activities', hi: 'सेवा गतिविधियाँ' },
    value: 50,
    suffix: '+',
    icon: 'heart-handshake',
  },
  {
    id: 'lives',
    label: { en: 'Lives Touched', hi: 'जीवन जिन्हें छुआ' },
    value: 1000,
    suffix: '+',
    icon: 'smile',
  },
];
