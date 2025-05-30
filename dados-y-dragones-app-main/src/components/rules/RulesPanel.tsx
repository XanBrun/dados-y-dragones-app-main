
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Dice6, Sword, Shield, Sparkles, Users, Target, Heart } from "lucide-react";

const RulesPanel = () => {
  const [selectedRule, setSelectedRule] = useState<string | null>(null);

  const ruleCategories = [
    {
      id: 'basic',
      title: 'Reglas Básicas',
      icon: BookOpen,
      color: 'bg-blue-500',
      rules: [
        {
          title: 'Dados y Tiradas',
          content: `
**Dado de 20 caras (d20):** Se usa para la mayoría de tiradas de habilidad, ataque y salvación.

**Modificadores:** Se suman o restan al resultado del dado según las habilidades del personaje.

**Dificultad (CD):** Número que debes igualar o superar para tener éxito.
- Fácil: CD 10
- Moderado: CD 15  
- Difícil: CD 20
- Muy Difícil: CD 25

**Ventaja/Desventaja:** 
- Ventaja: Tira 2d20, toma el mayor
- Desventaja: Tira 2d20, toma el menor
          `
        },
        {
          title: 'Habilidades',
          content: `
**Las 6 Habilidades Principales:**

**Fuerza (FUE):** Poder físico, cargar peso, ataques cuerpo a cuerpo.

**Destreza (DES):** Agilidad, reflejos, ataques a distancia, sigilo.

**Constitución (CON):** Resistencia, puntos de vida, aguante.

**Inteligencia (INT):** Razonamiento, memoria, conocimiento arcano.

**Sabiduría (SAB):** Percepción, intuición, medicina, supervivencia.

**Carisma (CAR):** Fuerza de personalidad, liderazgo, magia divina.

**Modificador de Habilidad:**
- 8-9: -1
- 10-11: 0  
- 12-13: +1
- 14-15: +2
- 16-17: +3
- 18-19: +4
- 20: +5
          `
        }
      ]
    },
    {
      id: 'combat',
      title: 'Combate',
      icon: Sword,
      color: 'bg-red-500',
      rules: [
        {
          title: 'Iniciativa y Turnos',
          content: `
**Iniciativa:** Al comenzar el combate, cada participante tira 1d20 + modificador de Destreza.

**Orden de Turnos:** Se actúa en orden de mayor a menor iniciativa.

**Turno del Jugador:** En tu turno puedes:
- Moverte hasta tu velocidad (normalmente 30 pies)
- Realizar 1 acción
- Realizar 1 acción adicional (si aplica)
- Realizar 1 reacción por ronda
          `
        },
        {
          title: 'Ataques y Daño',
          content: `
**Tirada de Ataque:** 1d20 + bono de competencia + modificador de habilidad

**Clase de Armadura (CA):** Número que el ataque debe igualar o superar.

**Tirada de Daño:** Depende del arma usada:
- Daga: 1d4 + modificador de FUE/DES
- Espada corta: 1d6 + modificador de FUE/DES  
- Espada larga: 1d8 + modificador de FUE
- Arco: 1d8 + modificador de DES

**Crítico:** Si sacas 20 natural, doblas los dados de daño.

**Fallo:** Si sacas 1 natural, es un fallo crítico.
          `
        },
        {
          title: 'Puntos de Vida',
          content: `
**Puntos de Vida (PV):** Representan tu capacidad de evitar heridas mortales.

**Reducir a 0 PV:** El personaje cae inconsciente y comienza a hacer tiradas de muerte.

**Tiradas de Muerte:** 
- Tira 1d20 cada turno
- 10 o más: Éxito
- 9 o menos: Fallo
- 3 éxitos: Te estabilizas en 1 PV
- 3 fallos: Mueres

**Curación:** 
- Descanso corto: Recuperas dados de golpe
- Descanso largo: Recuperas todos los PV
          `
        }
      ]
    },
    {
      id: 'magic',
      title: 'Magia',
      icon: Sparkles,
      color: 'bg-purple-500',
      rules: [
        {
          title: 'Lanzar Hechizos',
          content: `
**Componentes de Hechizo:**
- Verbal (V): Debes poder hablar
- Somático (S): Debes tener una mano libre
- Material (M): Necesitas un componente específico

**Niveles de Hechizo:** Del 0 (trucos) al 9 (más poderosos)

**Espacios de Hechizo:** Recursos limitados para lanzar hechizos. Se recuperan con descanso largo.

**Concentración:** Algunos hechizos requieren mantener la concentración. Si recibes daño, debes hacer una tirada de Constitución (CD 10 o la mitad del daño recibido).
          `
        },
        {
          title: 'Tipos de Hechizos',
          content: `
**Trucos (Nivel 0):** Se pueden lanzar ilimitadamente
- Rayo de Fuego: 1d10 de daño por fuego
- Luz: Ilumina un área  
- Prestidigitación: Efectos menores

**Hechizos de Nivel 1:**
- Misil Mágico: 1d4+1 de daño, siempre acierta
- Curar Heridas: Recupera 1d8+modificador PV
- Detectar Magia: Detecta auras mágicas

**Hechizos de Nivel 2:**
- Bola de Fuego: 8d6 de daño en área
- Invisibilidad: Te vuelves invisible
- Curar Heridas Moderadas: 2d8+modificador PV
          `
        }
      ]
    },
    {
      id: 'saves',
      title: 'Tiradas de Salvación',
      icon: Shield,
      color: 'bg-green-500',
      rules: [
        {
          title: 'Tipos de Salvación',
          content: `
**Fuerza:** Resistir ser empujado, agarrado o inmovilizado.

**Destreza:** Esquivar explosiones, trampas, hechizos de área.

**Constitución:** Resistir venenos, enfermedades, efectos necróticos.

**Inteligencia:** Resistir ilusiones mentales, algunos hechizos de encantamiento.

**Sabiduría:** Resistir encantamientos, efectos de miedo, algunos hechizos.

**Carisma:** Resistir destierro, posesión, algunos efectos mágicos.

**Cálculo:** 1d20 + modificador de habilidad + bono de competencia (si aplica)
          `
        },
        {
          title: 'Condiciones Comunes',
          content: `
**Envenenado:** Desventaja en tiradas de ataque y habilidad.

**Paralizado:** Incapacitado, no puedes moverte ni hablar.

**Asustado:** Desventaja en habilidades y ataques mientras veas la fuente del miedo.

**Encantado:** No puedes atacar al encantador, quien tiene ventaja en interacciones sociales.

**Inconsciente:** Incapacitado, no puedes moverte, los ataques contra ti tienen ventaja.

**Cegado:** No puedes ver, fallas tiradas que requieren vista, desventaja en ataques.
          `
        }
      ]
    },
    {
      id: 'skills',
      title: 'Habilidades y Competencias',
      icon: Target,
      color: 'bg-yellow-500',
      rules: [
        {
          title: 'Habilidades por Atributo',
          content: `
**Fuerza:**
- Atletismo: Escalar, saltar, nadar

**Destreza:**
- Acrobacias: Equilibrio, volteretas
- Juego de Manos: Robar, trucos de manos
- Sigilo: Moverse sin ser detectado

**Inteligencia:**
- Arcanos: Conocimiento mágico
- Historia: Conocimiento del pasado
- Investigación: Encontrar pistas
- Naturaleza: Conocimiento de la naturaleza
- Religión: Conocimiento divino

**Sabiduría:**
- Perspicacia: Leer intenciones
- Medicina: Curar, estabilizar
- Percepción: Notar detalles
- Supervivencia: Rastrear, orientarse
- Trato con Animales: Calmar bestias

**Carisma:**
- Engaño: Mentir convincentemente
- Intimidación: Asustar o coaccionar
- Interpretación: Actuar, cantar
- Persuasión: Convencer amistosamente
          `
        },
        {
          title: 'Usando Habilidades',
          content: `
**Competencia:** Si eres competente en una habilidad, añades tu bono de competencia.

**Bono de Competencia por Nivel:**
- Niveles 1-4: +2
- Niveles 5-8: +3  
- Niveles 9-12: +4
- Niveles 13-16: +5
- Niveles 17-20: +6

**Tirada de Habilidad:** 1d20 + modificador de atributo + bono de competencia (si aplica)

**Competencia Doble:** Algunas características permiten doblar el bono de competencia en ciertas habilidades.
          `
        }
      ]
    },
    {
      id: 'exploration',
      title: 'Exploración y Aventura',
      icon: Users,
      color: 'bg-indigo-500',
      rules: [
        {
          title: 'Movimiento y Viaje',
          content: `
**Velocidad Base:** La mayoría de razas tienen 30 pies de velocidad.

**Terreno Difícil:** Cada pie de movimiento cuesta 2 pies de velocidad.

**Viaje por Día:**
- Paso Normal: 24 millas (8 horas)
- Paso Rápido: 30 millas (desventaja en Percepción)
- Paso Lento: 18 millas (puede usar sigilo)

**Forzar la Marcha:** Después de 8 horas, tirada de Constitución CD 10 (+2 cada hora extra) o sufrir 1 nivel de agotamiento.

**Montar:** Un caballo puede viajar 50% más rápido.
          `
        },
        {
          title: 'Descansos',
          content: `
**Descanso Corto:** 1 hora de descanso
- Recuperas dados de golpe (puedes gastar algunos para recuperar PV)
- Algunas habilidades se recargan

**Descanso Largo:** 8 horas de descanso (6 durmiendo, 2 en actividad ligera)
- Recuperas todos los PV
- Recuperas dados de golpe gastados (hasta la mitad de tu máximo)
- Recuperas espacios de hechizo gastados
- Reduces agotamiento en 1 nivel

**Interrumpir Descanso:** Más de 1 hora de actividad vigorosa interrumpe el descanso largo.
          `
        },
        {
          title: 'Visión y Luz',
          content: `
**Luz Brillante:** Visión normal, la mayoría de criaturas pueden ver claramente.

**Luz Tenue:** Desventaja en tiradas de Percepción basadas en vista.

**Oscuridad:** Cegado a menos que tengas visión en la oscuridad.

**Visión en la Oscuridad:** Ves en la oscuridad como si fuera luz tenue hasta cierta distancia (normalmente 60 pies).

**Fuentes de Luz:**
- Antorcha: 20 pies luz brillante, 20 pies luz tenue
- Linterna: 30 pies luz brillante, 30 pies luz tenue
- Vela: 5 pies luz brillante, 5 pies luz tenue
          `
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50">
        <CardHeader>
          <CardTitle className="text-amber-900 flex items-center gap-2">
            <BookOpen size={24} />
            Compendio de Reglas de D&D
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-6">
              {ruleCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                    <IconComponent size={16} />
                    <span className="hidden sm:inline">{category.title}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {ruleCategories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <div className="grid gap-4">
                  {category.rules.map((rule, index) => (
                    <Card key={index} className="border hover:border-amber-300 transition-all">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                          {rule.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="max-h-96">
                          <div className="prose prose-sm max-w-none">
                            {rule.content.split('\n').map((line, lineIndex) => {
                              if (line.startsWith('**') && line.endsWith('**')) {
                                return (
                                  <h4 key={lineIndex} className="font-bold text-amber-800 mt-4 mb-2">
                                    {line.replace(/\*\*/g, '')}
                                  </h4>
                                );
                              } else if (line.startsWith('**') && line.includes(':**')) {
                                const [bold, rest] = line.split(':**');
                                return (
                                  <p key={lineIndex} className="mb-2">
                                    <strong className="text-amber-800">{bold.replace(/\*\*/g, '')}:</strong>
                                    {rest}
                                  </p>
                                );
                              } else if (line.startsWith('- ')) {
                                return (
                                  <div key={lineIndex} className="ml-4 mb-1 flex items-start gap-2">
                                    <span className="text-amber-600 mt-1">•</span>
                                    <span>{line.substring(2)}</span>
                                  </div>
                                );
                              } else if (line.trim()) {
                                return (
                                  <p key={lineIndex} className="mb-2 text-gray-700">
                                    {line}
                                  </p>
                                );
                              }
                              return <br key={lineIndex} />;
                            })}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Referencia rápida */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart size={20} className="text-red-500" />
            Referencia Rápida
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-3 border rounded-lg bg-blue-50">
              <h4 className="font-semibold text-blue-800 mb-2">Dados Comunes</h4>
              <div className="space-y-1 text-sm">
                <div>d4: Daga, hechizos menores</div>
                <div>d6: Espada corta, conjuros</div>
                <div>d8: Espada larga, ballesta</div>
                <div>d10: Hachas pesadas</div>
                <div>d12: Hacha a dos manos</div>
                <div>d20: Todas las tiradas principales</div>
              </div>
            </div>

            <div className="p-3 border rounded-lg bg-green-50">
              <h4 className="font-semibold text-green-800 mb-2">CD Comunes</h4>
              <div className="space-y-1 text-sm">
                <div>CD 5: Muy fácil</div>
                <div>CD 10: Fácil</div>
                <div>CD 15: Moderado</div>
                <div>CD 20: Difícil</div>
                <div>CD 25: Muy difícil</div>
                <div>CD 30: Casi imposible</div>
              </div>
            </div>

            <div className="p-3 border rounded-lg bg-red-50">
              <h4 className="font-semibold text-red-800 mb-2">Estados en Combate</h4>
              <div className="space-y-1 text-sm">
                <div>Inconsciente: 0 PV</div>
                <div>Paralizado: No puede moverse</div>
                <div>Asustado: Desventaja en ataques</div>
                <div>Envenenado: Desventaja general</div>
                <div>Encantado: No ataca al encantador</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RulesPanel;
