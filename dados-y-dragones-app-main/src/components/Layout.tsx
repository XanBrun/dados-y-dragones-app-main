
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dice6, User, Crown, ShoppingBag, BookOpen } from "lucide-react";
import DiceRoller from "./dice/DiceRoller";
import PlayerPanel from "./player/PlayerPanel";
import NarratorPanel from "./narrator/NarratorPanel";
import ShopPanel from "./shop/ShopPanel";
import RulesPanel from "./rules/RulesPanel";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="container mx-auto p-4 max-w-6xl">
        <header className="text-center mb-6">
          <h1 className="text-4xl font-bold text-amber-900 mb-2 drop-shadow-md">
            🎲 DADOS D&D
          </h1>
          <p className="text-amber-700">Tu compañero de aventuras digitales</p>
        </header>

        <Tabs defaultValue="dados" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6 bg-amber-100 border-2 border-amber-200">
            <TabsTrigger 
              value="dados" 
              className="flex items-center gap-2 data-[state=active]:bg-amber-500 data-[state=active]:text-white"
            >
              <Dice6 size={20} />
              <span className="hidden sm:inline">Lanzar Dados</span>
            </TabsTrigger>
            <TabsTrigger 
              value="jugador"
              className="flex items-center gap-2 data-[state=active]:bg-amber-500 data-[state=active]:text-white"
            >
              <User size={20} />
              <span className="hidden sm:inline">Jugador</span>
            </TabsTrigger>
            <TabsTrigger 
              value="narrador"
              className="flex items-center gap-2 data-[state=active]:bg-amber-500 data-[state=active]:text-white"
            >
              <Crown size={20} />
              <span className="hidden sm:inline">Narrador</span>
            </TabsTrigger>
            <TabsTrigger 
              value="tienda"
              className="flex items-center gap-2 data-[state=active]:bg-amber-500 data-[state=active]:text-white"
            >
              <ShoppingBag size={20} />
              <span className="hidden sm:inline">Tienda</span>
            </TabsTrigger>
            <TabsTrigger 
              value="reglas"
              className="flex items-center gap-2 data-[state=active]:bg-amber-500 data-[state=active]:text-white"
            >
              <BookOpen size={20} />
              <span className="hidden sm:inline">Reglas</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dados">
            <DiceRoller />
          </TabsContent>

          <TabsContent value="jugador">
            <PlayerPanel />
          </TabsContent>

          <TabsContent value="narrador">
            <NarratorPanel />
          </TabsContent>

          <TabsContent value="tienda">
            <ShopPanel />
          </TabsContent>

          <TabsContent value="reglas">
            <RulesPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Layout;
