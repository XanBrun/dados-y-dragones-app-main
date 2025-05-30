
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Enemy, CombatEncounter, InventoryItem } from '@/types/game';
import { ArrowLeft, QrCode, Plus, Minus } from "lucide-react";
import QRCode from 'qrcode';
import { SHOP_ITEMS } from '@/data/shopItems';

interface QRCombatGeneratorProps {
  enemies: Enemy[];
  onBack: () => void;
}

const QRCombatGenerator = ({ enemies, onBack }: QRCombatGeneratorProps) => {
  const [selectedEnemies, setSelectedEnemies] = useState<string[]>([]);
  const [encounterName, setEncounterName] = useState('Encuentro de Combate');
  const [rewardCoins, setRewardCoins] = useState(10);
  const [rewardItems, setRewardItems] = useState<string[]>([]);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Configurar enemigos para el combate con stats específicos
  const [enemyConfigs, setEnemyConfigs] = useState<Record<string, {
    health: number;
    attack: number;
    defense: number;
  }>>({});

  const handleEnemyToggle = (enemyId: string) => {
    if (selectedEnemies.includes(enemyId)) {
      setSelectedEnemies(selectedEnemies.filter(id => id !== enemyId));
      const newConfigs = { ...enemyConfigs };
      delete newConfigs[enemyId];
      setEnemyConfigs(newConfigs);
    } else {
      setSelectedEnemies([...selectedEnemies, enemyId]);
      const enemy = enemies.find(e => e.id === enemyId);
      if (enemy) {
        setEnemyConfigs({
          ...enemyConfigs,
          [enemyId]: {
            health: enemy.stats.health,
            attack: enemy.stats.attack,
            defense: enemy.stats.armorClass
          }
        });
      }
    }
  };

  const updateEnemyConfig = (enemyId: string, field: 'health' | 'attack' | 'defense', value: number) => {
    setEnemyConfigs({
      ...enemyConfigs,
      [enemyId]: {
        ...enemyConfigs[enemyId],
        [field]: value
      }
    });
  };

  const handleItemToggle = (itemId: string) => {
    if (rewardItems.includes(itemId)) {
      setRewardItems(rewardItems.filter(id => id !== itemId));
    } else {
      setRewardItems([...rewardItems, itemId]);
    }
  };

  const generateQR = async () => {
    if (selectedEnemies.length === 0) return;

    setIsGenerating(true);
    
    try {
      // Crear datos optimizados del enemigo (solo lo esencial)
      const combatEnemies = selectedEnemies.map(enemyId => {
        const enemy = enemies.find(e => e.id === enemyId)!;
        const config = enemyConfigs[enemyId];
        return {
          id: enemy.id,
          name: enemy.name,
          level: enemy.level,
          race: enemy.race,
          type: enemy.type,
          stats: {
            health: config.health,
            attack: config.attack,
            armorClass: config.defense,
            damage: enemy.stats.damage
          },
          attacks: enemy.attacks
        };
      });

      // Solo incluir IDs de items en lugar de objetos completos
      const rewardItemIds = rewardItems;

      const encounter: CombatEncounter = {
        id: crypto.randomUUID(),
        name: encounterName,
        enemies: combatEnemies,
        rewards: {
          coins: rewardCoins,
          experience: selectedEnemies.length * 25,
          items: rewardItemIds.map(itemId => SHOP_ITEMS.find(item => item.id === itemId)!).filter(Boolean)
        }
      };

      // Datos optimizados para QR - remover información innecesaria
      const optimizedQRData = {
        type: 'combat',
        encounter: {
          id: encounter.id,
          name: encounter.name,
          enemies: encounter.enemies.map(enemy => ({
            id: enemy.id,
            name: enemy.name,
            level: enemy.level,
            race: enemy.race,
            type: enemy.type,
            stats: enemy.stats,
            attacks: enemy.attacks.slice(0, 2) // Solo primeros 2 ataques
          })),
          rewards: {
            coins: encounter.rewards.coins,
            experience: encounter.rewards.experience,
            items: encounter.rewards.items?.slice(0, 3) // Solo primeros 3 items
          }
        },
        timestamp: Date.now()
      };

      const qrData = JSON.stringify(optimizedQRData);

      const qrUrl = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#4A5568',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      });

      setQrCodeUrl(qrUrl);
    } catch (error) {
      console.error('Error generando QR:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-violet-50">
      <CardHeader>
        <CardTitle className="text-purple-900 flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="p-1 h-auto"
          >
            <ArrowLeft size={20} />
          </Button>
          Generar QR de Combate
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Configuración básica */}
          <div>
            <Label htmlFor="encounterName">Nombre del Encuentro</Label>
            <Input
              id="encounterName"
              value={encounterName}
              onChange={(e) => setEncounterName(e.target.value)}
              placeholder="Nombre del encuentro..."
            />
          </div>

          {/* Selección de enemigos */}
          <div>
            <Label className="text-lg font-semibold">Enemigos del Combate</Label>
            <div className="grid gap-4 mt-4">
              {enemies.map((enemy) => (
                <div key={enemy.id} className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Checkbox
                      checked={selectedEnemies.includes(enemy.id)}
                      onCheckedChange={() => handleEnemyToggle(enemy.id)}
                    />
                    <div>
                      <h4 className="font-semibold">{enemy.name}</h4>
                      <p className="text-sm text-gray-600">{enemy.race} {enemy.type} - Nivel {enemy.level}</p>
                    </div>
                  </div>
                  
                  {selectedEnemies.includes(enemy.id) && (
                    <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t">
                      <div>
                        <Label htmlFor={`health-${enemy.id}`}>PV</Label>
                        <Input
                          id={`health-${enemy.id}`}
                          type="number"
                          min="1"
                          value={enemyConfigs[enemy.id]?.health || enemy.stats.health}
                          onChange={(e) => updateEnemyConfig(enemy.id, 'health', parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`attack-${enemy.id}`}>Ataque</Label>
                        <Input
                          id={`attack-${enemy.id}`}
                          type="number"
                          value={enemyConfigs[enemy.id]?.attack || enemy.stats.attack}
                          onChange={(e) => updateEnemyConfig(enemy.id, 'attack', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`defense-${enemy.id}`}>CA</Label>
                        <Input
                          id={`defense-${enemy.id}`}
                          type="number"
                          min="1"
                          value={enemyConfigs[enemy.id]?.defense || enemy.stats.armorClass}
                          onChange={(e) => updateEnemyConfig(enemy.id, 'defense', parseInt(e.target.value) || 1)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recompensas */}
          <div>
            <Label className="text-lg font-semibold">Recompensas</Label>
            
            <div className="mt-4">
              <Label htmlFor="rewardCoins">Monedas</Label>
              <Input
                id="rewardCoins"
                type="number"
                min="0"
                value={rewardCoins}
                onChange={(e) => setRewardCoins(parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="mt-4">
              <Label className="font-semibold">Objetos de Recompensa</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 max-h-60 overflow-y-auto">
                {SHOP_ITEMS.slice(0, 12).map((item) => (
                  <div key={item.id} className="flex items-center gap-2 p-2 border rounded">
                    <Checkbox
                      checked={rewardItems.includes(item.id)}
                      onCheckedChange={() => handleItemToggle(item.id)}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-gray-600">{item.price} monedas</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Generar QR */}
          <div className="flex gap-4">
            <Button 
              onClick={generateQR}
              disabled={selectedEnemies.length === 0 || isGenerating}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <QrCode size={18} className="mr-2" />
              {isGenerating ? 'Generando...' : 'Generar QR'}
            </Button>
          </div>

          {/* Mostrar QR */}
          {qrCodeUrl && (
            <div className="text-center p-6 bg-white rounded-lg border">
              <h3 className="font-semibold mb-4">QR de Combate Generado</h3>
              <img src={qrCodeUrl} alt="QR Code" className="mx-auto mb-4" />
              <p className="text-sm text-gray-600">
                Los jugadores pueden escanear este código para iniciar el combate
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Datos optimizados para menor tamaño del QR
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QRCombatGenerator;
