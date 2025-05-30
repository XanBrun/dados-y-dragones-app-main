
export function rollDice(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

export function rollMultipleDice(sides: number, count: number): number[] {
  return Array.from({ length: count }, () => rollDice(sides));
}

export function rollDiceString(diceString: string): { results: number[]; total: number } {
  // Parse strings like "1d6+2", "2d8", "1d20-1"
  const regex = /(\d+)d(\d+)([+-]\d+)?/i;
  const match = diceString.match(regex);
  
  if (!match) {
    return { results: [0], total: 0 };
  }

  const count = parseInt(match[1]);
  const sides = parseInt(match[2]);
  const modifier = match[3] ? parseInt(match[3]) : 0;

  const results = rollMultipleDice(sides, count);
  const total = results.reduce((sum, roll) => sum + roll, 0) + modifier;

  return { results, total };
}

export function calculateModifier(abilityScore: number): number {
  return Math.floor((abilityScore - 10) / 2);
}

export function rollWithAdvantage(sides: number): { results: number[]; total: number } {
  const roll1 = rollDice(sides);
  const roll2 = rollDice(sides);
  return {
    results: [roll1, roll2],
    total: Math.max(roll1, roll2)
  };
}

export function rollWithDisadvantage(sides: number): { results: number[]; total: number } {
  const roll1 = rollDice(sides);
  const roll2 = rollDice(sides);
  return {
    results: [roll1, roll2],
    total: Math.min(roll1, roll2)
  };
}
