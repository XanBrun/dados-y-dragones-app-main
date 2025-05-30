
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Character } from '@/types/game';
import { Trash2, Edit } from "lucide-react";

interface CharacterDetailsProps {
  character: Character;
  onUpdate: (character: Character) => void;
  onDelete: (characterId: string) => void;
}

const CharacterDetails = ({ character, onUpdate, onDelete }: CharacterDetailsProps) => {
  const handleDelete = () => {
    if (confirm(`¿Estás seguro de que quieres eliminar a ${character.name}?`)) {
      onDelete(character.id);
    }
  };

  return (
    <Card className="border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50">
      <CardHeader>
        <CardTitle className="text-indigo-900 flex items-center justify-between">
          <span>Detalles de {character.name}</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Edit size={16} className="mr-1" />
              Editar
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleDelete}
            >
              <Trash2 size={16} className="mr-1" />
              Eliminar
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Información Básica */}
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-lg mb-2">Información Básica</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Raza:</span>
                  <Badge variant="secondary">{character.race}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Clase:</span>
                  <Badge variant="secondary">{character.class}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nivel:</span>
                  <Badge>{character.level}</Badge>
                </div>
              </div>
            </div>

            {/* Estado */}
            <div>
              <h4 className="font-semibold text-lg mb-2">Estado</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Puntos de Vida:</span>
                  <Badge variant="outline" className="text-red-600">
                    {character.currentHealth}/{character.maxHealth}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monedas:</span>
                  <Badge variant="outline" className="text-yellow-600">
                    🪙 {character.coins}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Habilidades */}
          <div>
            <h4 className="font-semibold text-lg mb-2">Habilidades</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm">
                <span className="text-gray-600">Fuerza:</span>
                <Badge variant="outline" className="ml-2">{character.abilities.strength}</Badge>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Destreza:</span>
                <Badge variant="outline" className="ml-2">{character.abilities.dexterity}</Badge>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Constitución:</span>
                <Badge variant="outline" className="ml-2">{character.abilities.constitution}</Badge>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Inteligencia:</span>
                <Badge variant="outline" className="ml-2">{character.abilities.intelligence}</Badge>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Sabiduría:</span>
                <Badge variant="outline" className="ml-2">{character.abilities.wisdom}</Badge>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Carisma:</span>
                <Badge variant="outline" className="ml-2">{character.abilities.charisma}</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Inventario */}
        <div className="mt-6">
          <h4 className="font-semibold text-lg mb-2">Inventario</h4>
          {character.inventory.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {character.inventory.map((item, index) => (
                <Badge key={index} variant="outline">
                  {item.name}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">El inventario está vacío</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CharacterDetails;
