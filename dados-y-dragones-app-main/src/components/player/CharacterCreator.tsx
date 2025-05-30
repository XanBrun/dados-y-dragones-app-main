
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Character } from '@/types/game';
import { ArrowLeft, Save } from "lucide-react";

interface CharacterCreatorProps {
  onSave: (character: Character) => void;
  onCancel: () => void;
}

const races = [
  'Humano', 'Elfo', 'Enano', 'Mediano', 'Dracónido', 'Gnomo', 'Semielfo', 'Semiorco', 'Tiefling'
];

const classes = [
  'Bárbaro', 'Bardo', 'Clérigo', 'Druida', 'Explorador', 'Guerrero', 'Hechicero', 
  'Mago', 'Monje', 'Paladín', 'Pícaro', 'Brujo'
];

const CharacterCreator = ({ onSave, onCancel }: CharacterCreatorProps) => {
  const [name, setName] = useState('');
  const [race, setRace] = useState('');
  const [characterClass, setCharacterClass] = useState('');
  const [level, setLevel] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !race || !characterClass) {
      return;
    }

    const newCharacter: Character = {
      id: crypto.randomUUID(),
      name: name.trim(),
      race,
      class: characterClass,
      level,
      maxHealth: 10 + level * 5,
      currentHealth: 10 + level * 5,
      coins: 50,
      experience: 0,
      inventory: [],
      abilities: {
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
        armorClass: 10,
        proficiencyBonus: Math.ceil(level / 4) + 1
      }
    };

    onSave(newCharacter);
  };

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="text-blue-900 flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onCancel}
            className="p-1 h-auto"
          >
            <ArrowLeft size={20} />
          </Button>
          Crear Nuevo Personaje
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre del Personaje</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Introduce el nombre..."
              required
            />
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
              <Label htmlFor="class">Clase</Label>
              <Select value={characterClass} onValueChange={setCharacterClass} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una clase..." />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((classOption) => (
                    <SelectItem key={classOption} value={classOption}>
                      {classOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="level">Nivel</Label>
            <Input
              id="level"
              type="number"
              min="1"
              max="20"
              value={level}
              onChange={(e) => setLevel(parseInt(e.target.value) || 1)}
            />
          </div>
          
          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
              <Save size={18} className="mr-2" />
              Crear Personaje
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

export default CharacterCreator;
