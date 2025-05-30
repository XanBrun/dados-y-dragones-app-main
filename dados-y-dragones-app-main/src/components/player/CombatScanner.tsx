
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Character, QRCombatData } from '@/types/game';
import { ArrowLeft, Camera, Sword } from "lucide-react";
import QRScanner from './QRScanner';
import CombatArena from './CombatArena';

interface CombatScannerProps {
  character: Character;
  onUpdateCharacter: (character: Character) => void;
  onBack: () => void;
}

const CombatScanner = ({ character, onUpdateCharacter, onBack }: CombatScannerProps) => {
  const [combatData, setCombatData] = useState<QRCombatData | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [inCombat, setInCombat] = useState(false);

  const handleQRScanned = (data: QRCombatData) => {
    setCombatData(data);
    setShowScanner(false);
  };

  const startCombat = () => {
    setInCombat(true);
  };

  const handleCombatEnd = (updatedCharacter: Character, victory: boolean, rewards?: any) => {
    onUpdateCharacter(updatedCharacter);
    setInCombat(false);
    setCombatData(null);
  };

  if (inCombat && combatData) {
    return (
      <CombatArena
        character={character}
        encounter={combatData.encounter}
        onCombatEnd={handleCombatEnd}
        onBack={() => setInCombat(false)}
      />
    );
  }

  if (showScanner) {
    return (
      <QRScanner
        onScanSuccess={handleQRScanned}
        onBack={() => setShowScanner(false)}
      />
    );
  }

  return (
    <Card className="border-2 border-red-200 bg-gradient-to-r from-red-50 to-pink-50">
      <CardHeader>
        <CardTitle className="text-red-900 flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="p-1 h-auto"
          >
            <ArrowLeft size={20} />
          </Button>
          ⚔️ Combate - {character.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Información del personaje */}
        <div className="mb-6">
          <div className="text-sm text-gray-600 bg-white p-4 rounded-lg border">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="font-semibold">Personaje:</span>
                <p>{character.name}</p>
              </div>
              <div>
                <span className="font-semibold">PV:</span>
                <p>{character.currentHealth}/{character.maxHealth}</p>
              </div>
              <div>
                <span className="font-semibold">Nivel:</span>
                <p>{character.level}</p>
              </div>
              <div>
                <span className="font-semibold">CA:</span>
                <p>{character.abilities.armorClass}</p>
              </div>
            </div>
          </div>
        </div>

        {!combatData ? (
          <div className="text-center py-12">
            <Camera size={64} className="mx-auto text-red-400 mb-4" />
            <h3 className="text-xl font-bold text-red-600 mb-2">
              ¡Prepárate para el Combate!
            </h3>
            <p className="text-red-500 mb-6">
              Escanea el código QR del narrador para comenzar la batalla.
            </p>
            
            <Button 
              onClick={() => setShowScanner(true)}
              size="lg"
              className="bg-red-600 hover:bg-red-700"
            >
              <Camera size={20} className="mr-2" />
              Escanear QR de Combate
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-red-600 mb-4">
                Combate Detectado: {combatData.encounter.name}
              </h3>
            </div>

            {/* Información de enemigos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Enemigos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {combatData.encounter.enemies.map((enemy, index) => (
                    <div key={enemy.id} className="flex items-center justify-between p-3 border rounded-lg bg-red-50">
                      <div>
                        <h4 className="font-semibold">{enemy.name}</h4>
                        <p className="text-sm text-gray-600">{enemy.race} {enemy.type} - Nivel {enemy.level}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <Badge variant="destructive">PV: {enemy.stats.health}</Badge>
                        <Badge variant="outline">CA: {enemy.stats.armorClass}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recompensas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recompensas Potenciales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Monedas:</span>
                    <Badge variant="secondary">{combatData.encounter.rewards.coins} 🪙</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Experiencia:</span>
                    <Badge variant="secondary">{combatData.encounter.rewards.experience} XP</Badge>
                  </div>
                  {combatData.encounter.rewards.items && combatData.encounter.rewards.items.length > 0 && (
                    <div>
                      <span className="font-semibold">Objetos:</span>
                      <div className="mt-2 space-y-1">
                        {combatData.encounter.rewards.items.map((item, index) => (
                          <Badge key={index} variant="outline" className="mr-2">
                            {item.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Acciones */}
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={startCombat}
                size="lg"
                className="bg-red-600 hover:bg-red-700"
              >
                <Sword size={20} className="mr-2" />
                ¡Iniciar Combate!
              </Button>
              <Button 
                onClick={() => setCombatData(null)}
                variant="outline"
                size="lg"
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CombatScanner;
