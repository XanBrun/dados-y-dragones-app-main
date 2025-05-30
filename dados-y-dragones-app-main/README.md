
# Dados - Aplicación de Dados para D&D

Una aplicación moderna y responsiva para gestionar dados, personajes y combates inspirada en Dragones y Mazmorras.

## Características

### 🎲 Lanzar Dados
- Soporte completo para dados de D&D (d4, d6, d8, d10, d12, d20, d100)
- Selección individual o combinada de dados
- Incremento/decremento de cantidad con botones
- Resultados individuales y suma total
- Aplicación de modificadores y ventajas

### 👤 Jugador
- Creación de personajes con estadísticas completas
- Sistema de avatar con cámara o carga de imagen
- Inventario y gestión de equipamiento
- Sistema de combate con lectura de QR
- Seguimiento de experiencia y nivel

### 🎭 Narrador
- Creación de enemigos y encuentros
- Generador de códigos QR para combates
- Gestión de campañas
- Herramientas de narración

### 🏪 Tienda
- Compra de armas, armaduras y objetos
- Sistema de monedas y precios
- Efectos automáticos en estadísticas
- Gestión de inventario

### 📚 Reglas
- Guía básica de reglas de D&D
- Referencia rápida de mecánicas
- Sistema de características y salvaciones

## Tecnologías

- React + TypeScript
- Tailwind CSS para estilos
- Capacitor para funcionalidades nativas
- QR Code Generator/Scanner
- IndexedDB para almacenamiento local

## Instalación

```bash
npm install
npm run dev
```

## Estructura del Proyecto

```
src/
├── components/
│   ├── dice/          # Componentes de dados
│   ├── player/        # Gestión de jugadores
│   ├── narrator/      # Herramientas del narrador
│   ├── shop/          # Sistema de tienda
│   └── rules/         # Guías y reglas
├── hooks/             # Hooks personalizados
├── utils/             # Utilidades y helpers
├── types/             # Definiciones de TypeScript
└── data/              # Datos estáticos
```

## Licencia

Este proyecto respeta el copyright de Wizards of the Coast y utiliza únicamente contenido de libre disposición bajo la Open Game License.
