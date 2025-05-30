
import { DiceType } from '@/types/game';

export const DICE_TYPES: DiceType[] = [
  { id: 'd4', sides: 4, name: 'D4', color: 'bg-red-500' },
  { id: 'd6', sides: 6, name: 'D6', color: 'bg-blue-500' },
  { id: 'd8', sides: 8, name: 'D8', color: 'bg-green-500' },
  { id: 'd10', sides: 10, name: 'D10', color: 'bg-yellow-500' },
  { id: 'd12', sides: 12, name: 'D12', color: 'bg-purple-500' },
  { id: 'd20', sides: 20, name: 'D20', color: 'bg-amber-500' },
  { id: 'd100', sides: 100, name: 'D100', color: 'bg-gray-500' },
];
