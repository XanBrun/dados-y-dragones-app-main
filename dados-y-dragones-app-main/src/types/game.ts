
export interface DiceType {
  id: string;
  sides: number;
  name: string;
  color: string;
}

export interface DiceRoll {
  diceType: DiceType;
  count: number;
  results: number[];
  total: number;
  modifier?: number;
}

export interface Character {
  id: string;
  name: string;
  level: number;
  race: string;
  class: string;
  avatar?: string;
  abilities: CharacterStats;
  inventory: InventoryItem[];
  coins: number;
  experience: number;
  maxHealth: number;
  currentHealth: number;
}

export interface CharacterStats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  armorClass: number;
  proficiencyBonus: number;
}

export interface Enemy {
  id: string;
  name: string;
  level: number;
  race: string;
  type: string;
  image?: string;
  stats: EnemyStats;
  attacks: Attack[];
  currentHealth?: number;
  isDefeated?: boolean;
}

export interface EnemyStats {
  health: number;
  armorClass: number;
  attack: number;
  defense: number;
  damage: string; // e.g., "1d6+2"
}

export interface Attack {
  name: string;
  damage: string;
  bonus: number;
}

export interface CombatEncounter {
  id: string;
  name: string;
  enemies: Enemy[];
  rewards: {
    coins: number;
    experience: number;
    items?: InventoryItem[];
  };
}

export interface InventoryItem {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'potion' | 'scroll' | 'misc';
  description: string;
  price: number;
  icon?: string;
  effects?: ItemEffect[];
}

export interface ItemEffect {
  stat: keyof CharacterStats;
  modifier: number;
}

export interface ShopItem extends InventoryItem {
  inStock: boolean;
  category: string;
}

export interface QRCombatData {
  encounter: CombatEncounter;
  timestamp: number;
}
