
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Plus, QrCode } from "lucide-react";
import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Enemy } from '@/types/game';
import EnemyCreator from "./EnemyCreator";
import QRCombatGenerator from "./QRCombatGenerator";

const NarratorPanel = () => {
  const [showEnemyCreator, setShowEnemyCreator] = useState(false);
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  const [enemies, setEnemies] = useLocalStorage<Enemy[]>('narrator-enemies', []);

  const handleEnemyCreated = (enemy: Enemy) => {
    setEnemies([...enemies, enemy]);
    setShowEnemyCreator(false);
  };

  if (showEnemyCreator) {
    return (
      <EnemyCreator 
        onSave={handleEnemyCreated}
        onCancel={() => setShowEnemyCreator(false)}
      />
    );
  }

  if (showQRGenerator) {
    return (
      <QRCombatGenerator 
        enemies={enemies}
        onBack={() => setShowQRGenerator(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-violet-50">
        <CardHeader>
          <CardTitle className="text-purple-900 flex items-center gap-2">
            <Crown size={24} />
            Panel del Narrador
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Crown size={64} className="mx-auto text-purple-400 mb-4" />
            <h3 className="text-xl font-bold text-purple-600 mb-2">
              ¡Bienvenido, Maestro del Juego!
            </h3>
            <p className="text-purple-500 mb-6">
              Aquí podrás crear enemigos, generar códigos QR para combates y gestionar las aventuras.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                onClick={() => setShowEnemyCreator(true)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus size={18} className="mr-2" />
                Crear Enemigo
              </Button>
              <Button 
                onClick={() => setShowQRGenerator(true)}
                variant="outline"
                className="border-purple-500 text-purple-700 hover:bg-purple-50"
                disabled={enemies.length === 0}
              >
                <QrCode size={18} className="mr-2" />
                Generar QR de Combate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Enemigos */}
      {enemies.length > 0 && (
        <Card className="border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50">
          <CardHeader>
            <CardTitle className="text-amber-900">Enemigos Creados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {enemies.map((enemy) => (
                <div
                  key={enemy.id}
                  className="p-4 border-2 rounded-lg bg-white hover:border-amber-300 transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-orange-400 rounded-full flex items-center justify-center text-white font-bold">
                      {enemy.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{enemy.name}</h3>
                      <p className="text-sm text-gray-600">
                        {enemy.race} {enemy.type}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span>Nivel:</span>
                      <span>{enemy.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>PV:</span>
                      <span>{enemy.stats.health}</span>
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
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NarratorPanel;
