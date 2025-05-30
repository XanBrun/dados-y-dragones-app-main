import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingBag, Search, Coins, Plus } from "lucide-react";
import { SHOP_ITEMS, SHOP_CATEGORIES } from "@/data/shopItems";
import { ShopItem, Character } from '@/types/game';
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useToast } from "@/hooks/use-toast";

const ShopPanel = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [characters, setCharacters] = useLocalStorage<Character[]>('characters', []);
  const [selectedCharacter, setSelectedCharacter] = useState<string>('');
  const [cart, setCart] = useState<{ item: ShopItem; quantity: number }[]>([]);
  const { toast } = useToast();

  const filteredItems = SHOP_ITEMS.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch && item.inStock;
  });

  const addToCart = (item: ShopItem) => {
    if (!selectedCharacter) {
      toast({
        title: "Selecciona un personaje",
        description: "Debes seleccionar un personaje para comprar objetos",
        variant: "destructive",
      });
      return;
    }

    const character = characters.find(c => c.id === selectedCharacter);
    if (!character) return;

    if (item.price > character.coins) {
      toast({
        title: "Monedas insuficientes",
        description: `${character.name} no tiene suficientes monedas para comprar ${item.name}`,
        variant: "destructive",
      });
      return;
    }

    const existingItem = cart.find(cartItem => cartItem.item.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.item.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { item, quantity: 1 }]);
    }
    
    toast({
      title: "Añadido al carrito",
      description: `${item.name} agregado al carrito de ${character.name}`,
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(cartItem => cartItem.item.id !== itemId));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, cartItem) => total + (cartItem.item.price * cartItem.quantity), 0);
  };

  const completePurchase = () => {
    if (!selectedCharacter) return;

    const character = characters.find(c => c.id === selectedCharacter);
    if (!character) return;

    const totalPrice = getTotalPrice();
    
    if (totalPrice > character.coins) {
      toast({
        title: "Fondos insuficientes",
        description: `${character.name} no tiene suficientes monedas para esta compra`,
        variant: "destructive",
      });
      return;
    }

    // Actualizar el personaje con los nuevos objetos y monedas
    const updatedCharacter = {
      ...character,
      coins: character.coins - totalPrice,
      inventory: [
        ...character.inventory,
        ...cart.flatMap(cartItem => 
          Array(cartItem.quantity).fill(cartItem.item)
        )
      ]
    };

    // Aplicar efectos de los objetos comprados
    cart.forEach(cartItem => {
      if (cartItem.item.effects) {
        cartItem.item.effects.forEach(effect => {
          updatedCharacter.abilities[effect.stat] += effect.modifier * cartItem.quantity;
        });
      }
    });

    // Actualizar la lista de personajes
    setCharacters(characters.map(c => 
      c.id === selectedCharacter ? updatedCharacter : c
    ));

    setCart([]);
    
    toast({
      title: "¡Compra realizada!",
      description: `${character.name} ha gastado ${totalPrice} monedas. Le quedan ${updatedCharacter.coins} monedas.`,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="text-green-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={24} />
              Tienda del Aventurero
            </div>
            <Select value={selectedCharacter} onValueChange={setSelectedCharacter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Selecciona personaje" />
              </SelectTrigger>
              <SelectContent>
                {characters.map((character) => (
                  <SelectItem key={character.id} value={character.id}>
                    {character.name} - {character.coins} 🪙
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar objetos:</label>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Categoría:</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {SHOP_CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {cart.length > 0 && selectedCharacter && (
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardHeader>
            <CardTitle className="text-blue-900">
              🛒 Carrito de {characters.find(c => c.id === selectedCharacter)?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {cart.map((cartItem) => (
                <div key={cartItem.item.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div>
                    <h4 className="font-semibold">{cartItem.item.name}</h4>
                    <p className="text-sm text-gray-600">
                      {cartItem.item.price} monedas x {cartItem.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{cartItem.item.price * cartItem.quantity} 🪙</span>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => removeFromCart(cartItem.item.id)}
                    >
                      Quitar
                    </Button>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between pt-3 border-t">
                <span className="text-lg font-bold">Total: {getTotalPrice()} 🪙</span>
                <Button 
                  onClick={completePurchase}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={!selectedCharacter || getTotalPrice() > (characters.find(c => c.id === selectedCharacter)?.coins || 0)}
                >
                  Comprar Todo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            📦 Catálogo ({filteredItems.length} objetos)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="border hover:border-green-300 transition-all">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-lg">{item.name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {item.category}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Coins size={16} className="text-yellow-500" />
                          <span className="font-bold">{item.price}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600">
                      {item.description}
                    </p>

                    {item.effects && item.effects.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-purple-600">Efectos:</p>
                        {item.effects.map((effect, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            +{effect.modifier} {effect.stat}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <Button 
                      onClick={() => addToCart(item)}
                      className="w-full bg-green-600 hover:bg-green-700"
                      size="sm"
                      disabled={!selectedCharacter || item.price > (characters.find(c => c.id === selectedCharacter)?.coins || 0)}
                    >
                      <Plus size={16} className="mr-1" />
                      Añadir al Carrito
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-600 mb-2">
                No se encontraron objetos
              </h3>
              <p className="text-gray-500">
                Intenta con otros filtros de búsqueda.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ShopPanel;