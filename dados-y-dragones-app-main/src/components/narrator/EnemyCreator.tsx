
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Enemy } from '@/types/game';
import { ArrowLeft, Save } from "lucide-react";

interface EnemyCreatorProps {
  onSave: (enemy: Enemy) => void;
  onCancel: () => void;
}

const races = [
  'Humano', 'Elfo', 'Enano', 'Mediano', 'Dracónido', 'Gnomo', 'Semielfo', 'Semiorco', 'Tiefling',
  'Goblin', 'Orco', 'Trol', 'Ogro', 'Esqueleto', 'Zombi', 'Dragón', 'Lobo', 'Oso', 'Araña Gigante'
];

const enemyTypes = [
  'Bestia', 'Monstruosidad', 'Humanoide', 'No-muerto', 'Dragón', 'Demonio', 'Diabólico', 
  'Elemental', 'Fey', 'Gigante', 'Aberración', 'Celestial', 'Constructo', 'Planta'
];

const EnemyCreator = ({ onSave, onCancel }: EnemyCreatorProps) => {
  const [name, setName] = useState('');
  const [race, setRace] = useState('');
  const [type, setType] = useState('');
  const [level, setLevel] = useState(1);
  const [health, setHealth] = useState(10);
  const [armorClass, setArmorClass] = useState(10);
  const [attack, setAttack] = useState(0);
  const [defense, setDefense] = useState(0);
  const [damage, setDamage] = useState('1d6');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !race || !type) {
      return;
    }

    const newEnemy: Enemy = {
      id: crypto.randomUUID(),
      name: name.trim(),
      race,
      type,
      level,
      stats: {
        health,
        armorClass,
        attack,
        defense,
        damage
      },
      attacks: [
        {
          name: 'Ataque Básico',
          damage,
          bonus: attack
        }
      ]
    };

    onSave(newEnemy);
  };

  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-violet-50">
      <CardHeader>
        <CardTitle className="text-purple-900 flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onCancel}
            className="p-1 h-auto"
          >
            <ArrowLeft size={20} />
          </Button>
          Crear Nuevo Enemigo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nombre del Enemigo</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Introduce el nombre..."
                required
              />
            </div>
            
            <div>
              <Label htmlFor="level">Nivel</Label>
              <Input
                id="level"
                type="number"
                min="1"
                max="30"
                value={level}
                onChange={(e) => setLevel(parseInt(e.target.value) || 1)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="race">Raza</Label>
              <Select value={race} onValueChange={setRace} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una raza..." />
                </SelectTrigger>
                <SelectContent>
                  {races.map((raceOption) => (
                    <SelectItem key={raceOption} value={raceOption}>
                      {raceOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="type">Tipo de Criatura</Label>
              <Select value={type} onValueChange={setType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un tipo..." />
                </SelectTrigger>
                <SelectContent>
                  {enemyTypes.map((typeOption) => (
                    <SelectItem key={typeOption} value={typeOption}>
                      {typeOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="health">Puntos de Vida</Label>
              <Input
                id="health"
                type="number"
                min="1"
                value={health}
                onChange={(e) => setHealth(parseInt(e.target.value) || 10)}
              />
            </div>
            
            <div>
              <Label htmlFor="armorClass">Clase de Armadura</Label>
              <Input
                id="armorClass"
                type="number"
                min="1"
                max="30"
                value={armorClass}
                onChange={(e) => setArmorClass(parseInt(e.target.value) || 10)}
              />
            </div>
            
            <div>
              <Label htmlFor="attack">Bonificador de Ataque</Label>
              <Input
                id="attack"
                type="number"
                value={attack}
                onChange={(e) => setAttack(parseInt(e.target.value) || 0)}
              />
            </div>
            
            <div>
              <Label htmlFor="defense">Bonificador de Defensa</Label>
              <Input
                id="defense"
                type="number"
                value={defense}
                onChange={(e) => setDefense(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="damage">Daño (ej: 1d6+2)</Label>
            <Input
              id="damage"
              value={damage}
              onChange={(e) => setDamage(e.target.value)}
              placeholder="1d6, 2d8+3, etc."
            />
          </div>
          
          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700">
              <Save size={18} className="mr-2" />
              Crear Enemigo
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EnemyCreator;
