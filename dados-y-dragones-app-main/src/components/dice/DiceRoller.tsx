
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, RotateCcw, Zap } from "lucide-react";
import { DICE_TYPES } from '@/data/dice';
import { DiceType, DiceRoll } from '@/types/game';
import { rollMultipleDice, rollWithAdvantage, rollWithDisadvantage } from '@/utils/dice';
import { toast } from "@/hooks/use-toast";

const DiceRoller = () => {
  const [selectedDice, setSelectedDice] = useState<Map<string, number>>(new Map());
  const [modifier, setModifier] = useState<number>(0);
  const [lastRolls, setLastRolls] = useState<DiceRoll[]>([]);
  const [isRolling, setIsRolling] = useState(false);

  const updateDiceCount = (diceId: string, change: number) => {
    const newSelected = new Map(selectedDice);
    const currentCount = newSelected.get(diceId) || 0;
    const newCount = Math.max(0, Math.min(10, currentCount + change));
    
    if (newCount === 0) {
      newSelected.delete(diceId);
    } else {
      newSelected.set(diceId, newCount);
    }
    
    setSelectedDice(newSelected);
  };

  const rollDice = async (advantage?: 'advantage' | 'disadvantage') => {
    if (selectedDice.size === 0) {
      toast({
        title: "¡Selecciona dados!",
        description: "Debes seleccionar al menos un dado para lanzar.",
        variant: "destructive"
      });
      return;
    }

    setIsRolling(true);

    // Simular animación de dados
    await new Promise(resolve => setTimeout(resolve, 800));

    const rolls: DiceRoll[] = [];
    let grandTotal = 0;

    selectedDice.forEach((count, diceId) => {
      const diceType = DICE_TYPES.find(d => d.id === diceId)!;
      let results: number[];

      if (advantage === 'advantage' && diceType.sides === 20) {
        const advantageRoll = rollWithAdvantage(diceType.sides);
        results = [advantageRoll.total];
        toast({
          title: "🎯 ¡Ventaja!",
          description: `Tiradas: ${advantageRoll.results.join(', ')} - Mejor: ${advantageRoll.total}`,
        });
      } else if (advantage === 'disadvantage' && diceType.sides === 20) {
        const disadvantageRoll = rollWithDisadvantage(diceType.sides);
        results = [disadvantageRoll.total];
        toast({
          title: "💔 Desventaja",
          description: `Tiradas: ${disadvantageRoll.results.join(', ')} - Peor: ${disadvantageRoll.total}`,
        });
      } else {
        results = rollMultipleDice(diceType.sides, count);
      }

      const total = results.reduce((sum, roll) => sum + roll, 0);
      grandTotal += total;

      rolls.push({
        diceType,
        count,
        results,
        total,
        modifier: modifier
      });
    });

    grandTotal += modifier;

    setLastRolls(rolls);
    setIsRolling(false);

    // Mostrar resultado con efecto especial para críticos
    if (rolls.some(roll => roll.diceType.sides === 20 && roll.results.includes(20))) {
      toast({
        title: "🔥 ¡CRÍTICO NATURAL!",
        description: `¡Sacaste un 20! Total: ${grandTotal}`,
      });
    } else if (rolls.some(roll => roll.diceType.sides === 20 && roll.results.includes(1))) {
      toast({
        title: "💀 Pifia Natural",
        description: `Sacaste un 1... Total: ${grandTotal}`,
        variant: "destructive"
      });
    } else {
      toast({
        title: "🎲 Resultado",
        description: `Total: ${grandTotal}`,
      });
    }
  };

  const clearAll = () => {
    setSelectedDice(new Map());
    setModifier(0);
    setLastRolls([]);
  };

  const totalSelected = Array.from(selectedDice.values()).reduce((sum, count) => sum + count, 0);
  const grandTotal = lastRolls.reduce((sum, roll) => sum + roll.total, 0) + modifier;

  return (
    <div className="space-y-6">
      {/* Selección de Dados */}
      <Card className="border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50">
        <CardHeader>
          <CardTitle className="text-amber-900 flex items-center gap-2">
            🎲 Seleccionar Dados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {DICE_TYPES.map((dice) => {
              const count = selectedDice.get(dice.id) || 0;
              return (
                <div key={dice.id} className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-2 rounded-lg ${dice.color} text-white font-bold text-lg flex items-center justify-center shadow-lg transition-transform ${count > 0 ? 'scale-110 ring-4 ring-amber-400' : ''}`}>
                    {dice.name}
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateDiceCount(dice.id, -1)}
                      disabled={count === 0}
                      className="w-8 h-8 p-0"
                    >
                      <Minus size={14} />
                    </Button>
                    <span className="w-8 text-center font-semibold">{count}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateDiceCount(dice.id, 1)}
                      disabled={count >= 10}
                      className="w-8 h-8 p-0"
                    >
                      <Plus size={14} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modificador */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <label className="font-semibold text-amber-900">Modificador:</label>
            <Input
              type="number"
              value={modifier}
              onChange={(e) => setModifier(parseInt(e.target.value) || 0)}
              className="w-20 text-center"
              min="-20"
              max="20"
            />
          </div>

          {/* Información de dados seleccionados */}
          {totalSelected > 0 && (
            <div className="mt-4 text-center">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {totalSelected} dado{totalSelected !== 1 ? 's' : ''} seleccionado{totalSelected !== 1 ? 's' : ''}
                {modifier !== 0 && ` (${modifier >= 0 ? '+' : ''}${modifier})`}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Botones de Lanzamiento */}
      <div className="flex flex-wrap justify-center gap-4">
        <Button
          onClick={() => rollDice()}
          disabled={selectedDice.size === 0 || isRolling}
          size="lg"
          className="bg-amber-600 hover:bg-amber-700 text-white min-w-32"
        >
          {isRolling ? (
            <div className="animate-spin">🎲</div>
          ) : (
            '🎲 Lanzar'
          )}
        </Button>

        <Button
          onClick={() => rollDice('advantage')}
          disabled={selectedDice.size === 0 || isRolling || !selectedDice.has('d20')}
          variant="outline"
          size="lg"
          className="border-green-500 text-green-700 hover:bg-green-50"
        >
          <Zap size={18} className="mr-2" />
          Ventaja
        </Button>

        <Button
          onClick={() => rollDice('disadvantage')}
          disabled={selectedDice.size === 0 || isRolling || !selectedDice.has('d20')}
          variant="outline"
          size="lg"
          className="border-red-500 text-red-700 hover:bg-red-50"
        >
          💔 Desventaja
        </Button>

        <Button
          onClick={clearAll}
          variant="outline"
          size="lg"
          className="border-gray-500 text-gray-700 hover:bg-gray-50"
        >
          <RotateCcw size={18} className="mr-2" />
          Limpiar
        </Button>
      </div>

      {/* Resultados */}
      {lastRolls.length > 0 && (
        <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="text-green-900 flex items-center gap-2">
              🎯 Resultados de la Tirada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lastRolls.map((roll, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded ${roll.diceType.color} text-white text-sm font-bold flex items-center justify-center`}>
                      {roll.diceType.name}
                    </div>
                    <span className="font-semibold">{roll.count}x</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-gray-600">
                      [{roll.results.join(', ')}]
                    </div>
                    <Badge variant="outline" className="font-bold">
                      {roll.total}
                    </Badge>
                  </div>
                </div>
              ))}
              
              {modifier !== 0 && (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="font-semibold text-blue-900">Modificador</span>
                  <Badge variant="outline" className="font-bold text-blue-900">
                    {modifier >= 0 ? '+' : ''}{modifier}
                  </Badge>
                </div>
              )}

              <div className="flex items-center justify-between p-4 bg-amber-100 rounded-lg border-2 border-amber-300">
                <span className="text-xl font-bold text-amber-900">TOTAL</span>
                <Badge className="text-2xl font-bold px-4 py-2 bg-amber-600 text-white">
                  {grandTotal}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DiceRoller;
