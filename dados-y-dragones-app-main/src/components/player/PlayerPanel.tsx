
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Plus, Camera, Upload } from "lucide-react";
import { Character } from '@/types/game';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import CharacterCreator from './CharacterCreator';
import CharacterDetails from './CharacterDetails';
import CombatScanner from './CombatScanner';

const PlayerPanel = () => {
  const [characters, setCharacters] = useLocalStorage<Character[]>('characters', []);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    characters.length > 0 ? characters[0] : null
  );
  const [showCreator, setShowCreator] = useState(false);
  const [showCombat, setShowCombat] = useState(false);

  const handleCreateCharacter = (newCharacter: Character) => {
    const updatedCharacters = [...characters, newCharacter];
    setCharacters(updatedCharacters);
    setSelectedCharacter(newCharacter);
    setShowCreator(false);
  };

  const handleUpdateCharacter = (updatedCharacter: Character) => {
    const updatedCharacters = characters.map(char => 
      char.id === updatedCharacter.id ? updatedCharacter : char
    );
    setCharacters(updatedCharacters);
    setSelectedCharacter(updatedCharacter);
  };

  const handleDeleteCharacter = (characterId: string) => {
    const updatedCharacters = characters.filter(char => char.id !== characterId);
    setCharacters(updatedCharacters);
    
    if (selectedCharacter?.id === characterId) {
      setSelectedCharacter(updatedCharacters.length > 0 ? updatedCharacters[0] : null);
    }
  };

  if (showCreator) {
    return (
      <CharacterCreator
        onSave={handleCreateCharacter}
        onCancel={() => setShowCreator(false)}
      />
    );
  }

  if (showCombat && selectedCharacter) {
    return (
      <CombatScanner
        character={selectedCharacter}
        onUpdateCharacter={handleUpdateCharacter}
        onBack={() => setShowCombat(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="text-blue-900 flex items-center gap-2">
            <User size={24} />
            Panel del Jugador
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={() => setShowCreator(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus size={18} className="mr-2" />
              Crear Personaje
            </Button>
            
            {selectedCharacter && (
              <Button 
                onClick={() => setShowCombat(true)}
                variant="outline"
                className="border-red-500 text-red-700 hover:bg-red-50"
              >
                ⚔️ Iniciar Combate
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lista de Personajes */}
      {characters.length > 0 && (
        <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="text-purple-900">Mis Personajes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {characters.map((character) => (
                <div
                  key={character.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedCharacter?.id === character.id
                      ? 'border-purple-500 bg-purple-100'
                      : 'border-gray-200 bg-white hover:border-purple-300'
                  }`}
                  onClick={() => setSelectedCharacter(character)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                      {character.avatar ? (
                        <img 
                          src={character.avatar} 
                          alt={character.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        character.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{character.name}</h3>
                      <p className="text-sm text-gray-600">
                        {character.race} {character.class}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary">Nivel {character.level}</Badge>
                    <div className="flex gap-2">
                      <Badge variant="outline">❤️ {character.currentHealth}/{character.maxHealth}</Badge>
                      <Badge variant="outline">🪙 {character.coins}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detalles del Personaje Seleccionado */}
      {selectedCharacter && (
        <CharacterDetails
          character={selectedCharacter}
          onUpdate={handleUpdateCharacter}
          onDelete={handleDeleteCharacter}
        />
      )}

      {/* Mensaje si no hay personajes */}
      {characters.length === 0 && (
        <Card className="border-2 border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50">
          <CardContent className="text-center py-12">
            <User size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">
              ¡Bienvenido, Aventurero!
            </h3>
            <p className="text-gray-500 mb-6">
              Crea tu primer personaje para comenzar tu aventura en el mundo de D&D.
            </p>
            <Button 
              onClick={() => setShowCreator(true)}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus size={20} className="mr-2" />
              Crear Mi Primer Personaje
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PlayerPanel;
