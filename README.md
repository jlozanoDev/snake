# Snake — Juego en Vue + Vite

> Pequeño proyecto de ejemplo: una versión del clásico juego Snake construida con Vue y Vite.

## Demo

Abre el proyecto localmente y ejecuta el servidor de desarrollo para probarlo.

## Requisitos
- Node.js 16+ y npm (o yarn)

## Instalación

1. Clona el repositorio o descarga los archivos.
2. Instala dependencias:

```bash
npm install
```

## Desarrollo

Inicia el servidor de desarrollo (Vite):

```bash
npm run dev
```

Esto abrirá la aplicación en `http://localhost:5173` (u otro puerto que Vite muestre).

## Compilar para producción

```bash
npm run build
```

Los archivos compilados quedarán en la carpeta `dist/`.

## Cómo jugar
- Usa las flechas del teclado o `W A S D` para mover la serpiente.
- Come la comida para crecer. Evita chocar contra las paredes o contigo mismo.

## Estructura del proyecto

- [package.json](package.json) — scripts y dependencias
- [vite.config.js](vite.config.js) — configuración de Vite
- [src/](src/) — código fuente
  - [src/App.vue](src/App.vue) — componente raíz
  - [src/main.js](src/main.js) — punto de entrada
  - [src/components/HelloWorld.vue](src/components/HelloWorld.vue) — componente de ejemplo
- public/ — activos estáticos

## Contribuir

Si quieres mejorar el juego (nuevas características, pulir la jugabilidad, añadir tests), abre un issue o crea un pull request.

## Notas
- Ajusta la licencia y los créditos según corresponda.
# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
