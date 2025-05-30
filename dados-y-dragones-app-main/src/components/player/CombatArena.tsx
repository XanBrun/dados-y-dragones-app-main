
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Character, Enemy, CombatEncounter } from '@/types/game';
import { ArrowLeft, Sword, Shield, UserX } from "lucide-react";
import { rollDice, rollDiceString, calculateModifier } from '@/utils/dice';
import { useToast } from "@/hooks/use-toast";

interface CombatArenaProps {
  character: Character;
  encounter: CombatEncounter;
  onCombatEnd: (character: Character, victory: boolean, rewards?: any) => void;
  onBack: () => void;
}

interface CombatLog {
  id: string;
  message: string;
  type: 'player' | 'enemy' | 'system';
  timestamp: number;
}

const CombatArena = ({ character, encounter, onCombatEnd, onBack }: CombatArenaProps) => {
  const [combatCharacter, setCombatCharacter] = useState<Character>({ ...character });
  const [enemies, setEnemies] = useState<Enemy[]>(encounter.enemies.map(e => ({ ...e, currentHealth: e.stats.health, isDefeated: false })));
  const [combatLog, setCombatLog] = useState<CombatLog[]>([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [combatEnded, setCombatEnded] = useState(false);
  const { toast } = useToast();

  const addToLog = (message: string, type: 'player' | 'enemy' | 'system' = 'system') => {
    const logEntry: CombatLog = {
      id: crypto.randomUUID(),
      message,
      type,
      timestamp: Date.now()
    };
    setCombatLog(prev => [...prev, logEntry]);
  };

  useEffect(() => {
    addToLog(`¡Comienza el combate! ${character.name} se enfrenta a ${encounter.name}`, 'system');
  }, []);

  const getNextActiveEnemy = () => {
    return enemies.find(enemy => !enemy.isDefeated);
  };

  const playerAttack = () => {
    const target = getNextActiveEnemy();
    if (!target) return;

    // Tirada de ataque del jugador (1d20 + modificador de fuerza + bono de competencia)
    const attackRoll = rollDice(20);
    const strengthMod = calculateModifier(combatCharacter.abilities.strength);
    const totalAttack = attackRoll + strengthMod + combatCharacter.abilities.proficiencyBonus;

    addToLog(`${combatCharacter.name} ataca a ${target.name}. Tirada: ${attackRoll} + ${strengthMod + combatCharacter.abilities.proficiencyBonus} = ${totalAttack}`, 'player');

    if (totalAttack >= target.stats.armorClass) {
      // Golpe exitoso - calcular daño (1d6 + modificador de fuerza por defecto)
      const damageRoll = rollDice(6);
      const totalDamage = damageRoll + strengthMod;
      
      addToLog(`¡Golpe! Daño: ${damageRoll} + ${strengthMod} = ${totalDamage}`, 'player');

      // Actualizar vida del enemigo
      const newEnemies = enemies.map(enemy => {
        if (enemy.id === target.id) {
          const newHealth = Math.max(0, (enemy.currentHealth || enemy.stats.health) - totalDamage);
          const defeated = newHealth <= 0;
          
          if (defeated) {
            addToLog(`${enemy.name} ha sido derrotado!`, 'system');
          }
          
          return {
            ...enemy,
            currentHealth: newHealth,
            isDefeated: defeated
          };
        }
        return enemy;
      });

      setEnemies(newEnemies);

      // Verificar si todos los enemigos están derrotados
      if (newEnemies.every(enemy => enemy.isDefeated)) {
        endCombat(true);
        return;
      }
    } else {
      addToLog(`¡Fallo! El ataque no supera la CA ${target.stats.armorClass}`, 'player');
    }

    // Cambiar turno
    setIsPlayerTurn(false);
    setTimeout(() => enemyTurn(), 1500);
  };

  const enemyTurn = () => {
    const activeEnemies = enemies.filter(enemy => !enemy.isDefeated);
    
    if (activeEnemies.length === 0) {
      endCombat(true);
      return;
    }

    let turnIndex = 0;
    const processNextEnemy = () => {
      if (turnIndex >= activeEnemies.length) {
        setIsPlayerTurn(true);
        return;
      }

      const enemy = activeEnemies[turnIndex];
      
      // Tirada de ataque del enemigo
      const attackRoll = rollDice(20);
      const totalAttack = attackRoll + enemy.stats.attack;
      
      addToLog(`${enemy.name} ataca a ${combatCharacter.name}. Tirada: ${attackRoll} + ${enemy.stats.attack} = ${totalAttack}`, 'enemy');

      if (totalAttack >= combatCharacter.abilities.armorClass) {
        // Golpe exitoso - calcular daño
        const damageResult = rollDiceString(enemy.stats.damage);
        const totalDamage = damageResult.total;
        
        addToLog(`¡Golpe! Daño: ${totalDamage}`, 'enemy');

        // Actualizar vida del jugador
        const newHealth = Math.max(0, combatCharacter.currentHealth - totalDamage);
        setCombatCharacter(prev => ({ ...prev, currentHealth: newHealth }));

        if (newHealth <= 0) {
          endCombat(false);
          return;
        }
      } else {
        addToLog(`¡Fallo! El ataque no supera la CA ${combatCharacter.abilities.armorClass}`, 'enemy');
      }

      turnIndex++;
      setTimeout(processNextEnemy, 1000);
    };

    processNextEnemy();
  };

  const retreat = () => {
    addToLog(`${combatCharacter.name} se retira del combate`, 'system');
    endCombat(false, true);
  };

  const endCombat = (victory: boolean, retreat: boolean = false) => {
    setCombatEnded(true);
    
    if (victory) {
      addToLog(`¡Victoria! ${combatCharacter.name} ha ganado el combate`, 'system');
      addToLog(`Recompensas: ${encounter.rewards.coins} monedas, ${encounter.rewards.experience} XP`, 'system');
      
      if (encounter.rewards.items && encounter.rewards.items.length > 0) {
        addToLog(`Objetos obtenidos: ${encounter.rewards.items.map(item => item.name).join(', ')}`, 'system');
      }

      // Aplicar recompensas
      const updatedCharacter = {
        ...combatCharacter,
        coins: combatCharacter.coins + encounter.rewards.coins,
        experience: combatCharacter.experience + encounter.rewards.experience,
        inventory: [...combatCharacter.inventory, ...(encounter.rewards.items || [])]
      };

      toast({
        title: "¡Victoria!",
        description: `Has ganado ${encounter.rewards.coins} monedas y ${encounter.rewards.experience} XP`,
      });

      onCombatEnd(updatedCharacter, true, encounter.rewards);
    } else if (retreat) {
      addToLog(`Combate terminado por retirada. No se obtienen recompensas.`, 'system');
      
      toast({
        title: "Retirada",
        description: "Te has retirado del combate sin recompensas",
        variant: "destructive"
      });

      onCombatEnd(combatCharacter, false);
    } else {
      addToLog(`${combatCharacter.name} ha sido derrotado...`, 'system');
      
      toast({
        title: "Derrota",
        description: "Has sido derrotado en combate",
        variant: "destructive"
      });

      onCombatEnd(combatCharacter, false);
    }
  };

  return (
    <Card className="border-2 border-red-200 bg-gradient-to-r from-red-50 to-pink-50">
      <CardHeader>
        <CardTitle className="text-red-900 flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="p-1 h-auto"
            disabled={!combatEnded}
          >
            <ArrowLeft size={20} />
          </Button>
          ⚔️ {encounter.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Estado del Jugador */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{combatCharacter.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>PV:</span>
                  <Badge variant={combatCharacter.currentHealth <= combatCharacter.maxHealth * 0.25 ? "destructive" : "default"}>
                    {combatCharacter.currentHealth}/{combatCharacter.maxHealth}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>CA:</span>
                  <Badge variant="outline">{combatCharacter.abilities.armorClass}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Nivel:</span>
                  <Badge variant="secondary">{combatCharacter.level}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Acciones de Combate */}
            {!combatEnded && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Acciones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    onClick={playerAttack}
                    disabled={!isPlayerTurn || combatCharacter.currentHealth <= 0}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    <Sword size={16} className="mr-2" />
                    Atacar
                  </Button>
                  <Button 
                    onClick={retreat}
                    disabled={!isPlayerTurn}
                    variant="outline"
                    className="w-full border-gray-500 text-gray-700 hover:bg-gray-50"
                  >
                    <UserX size={16} className="mr-2" />
                    Retirarse
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Estado de los Enemigos */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Enemigos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {enemies.map((enemy, index) => (
                  <div 
                    key={enemy.id} 
                    className={`p-3 border rounded ${enemy.isDefeated ? 'bg-gray-100 opacity-50' : 'bg-white'}`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">{enemy.name}</h4>
                      {enemy.isDefeated && <Badge variant="destructive">Derrotado</Badge>}
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>PV:</span>
                        <span>{enemy.currentHealth || 0}/{enemy.stats.health}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>CA:</span>
                        <span>{enemy.stats.armorClass}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ataque:</span>
                        <span>+{enemy.stats.attack}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Log de Combate */}
          <div>
            <Card className="h-96">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Log de Combate</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-80 px-4">
                  <div className="space-y-2">
                    {combatLog.map((log) => (
                      <div 
                        key={log.id} 
                        className={`text-sm p-2 rounded ${
                          log.type === 'player' ? 'bg-blue-100 text-blue-800' :
                          log.type === 'enemy' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {log.message}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>

        {combatEnded && (
          <div className="mt-6 text-center">
            <Button 
              onClick={onBack}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Finalizar Combate
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CombatArena;
