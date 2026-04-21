<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const GRID_SIZE = 20
const TICK_MS = 130
const INITIAL_SNAKE = [
  { x: 8, y: 10 },
  { x: 7, y: 10 },
  { x: 6, y: 10 }
]
const rowTemplate = `repeat(${GRID_SIZE}, 1fr)`

const snake = ref([])
const direction = ref({ x: 1, y: 0 })
const nextDirection = ref({ x: 1, y: 0 })
const food = ref(null)
const score = ref(0)
const isRunning = ref(false)
const isGameOver = ref(false)
const isWinner = ref(false)

let intervalId = null

const cells = computed(() => {
  const segments = snake.value
  const segmentSet = new Set(segments.map((segment) => `${segment.x},${segment.y}`))
  const head = segments[0]

  return Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => {
    const x = index % GRID_SIZE
    const y = Math.floor(index / GRID_SIZE)
    const key = `${x},${y}`

    if (head && head.x === x && head.y === y) return 'cell-head'
    if (food.value && food.value.x === x && food.value.y === y) return 'cell-food'
    if (segmentSet.has(key)) return 'cell-snake'
    return ''
  })
})

const statusText = computed(() => {
  if (isWinner.value) return '¡Ganaste! No quedan más espacios libres.'
  if (isGameOver.value) return 'Juego terminado. Presiona reiniciar.'
  if (!isRunning.value) return 'Presiona Iniciar o usa flechas para empezar.'
  return 'En juego...'
})

function samePosition(a, b) {
  return a.x === b.x && a.y === b.y
}

function isOpposite(a, b) {
  return a.x + b.x === 0 && a.y + b.y === 0
}

function getRandomFoodPosition(currentSnake) {
  const occupied = new Set(currentSnake.map((segment) => `${segment.x},${segment.y}`))
  const free = []

  for (let y = 0; y < GRID_SIZE; y += 1) {
    for (let x = 0; x < GRID_SIZE; x += 1) {
      const key = `${x},${y}`
      if (!occupied.has(key)) free.push({ x, y })
    }
  }

  if (free.length === 0) return null
  return free[Math.floor(Math.random() * free.length)]
}

function stopLoop() {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

function endGame(winner = false) {
  isWinner.value = winner
  isGameOver.value = !winner
  isRunning.value = false
  stopLoop()
}

function tick() {
  if (!isRunning.value) return

  direction.value = nextDirection.value
  const currentHead = snake.value[0]
  const nextHead = {
    x: currentHead.x + direction.value.x,
    y: currentHead.y + direction.value.y
  }

  const hitWall =
    nextHead.x < 0 ||
    nextHead.x >= GRID_SIZE ||
    nextHead.y < 0 ||
    nextHead.y >= GRID_SIZE

  if (hitWall) {
    endGame(false)
    return
  }

  const willEat = food.value && samePosition(nextHead, food.value)
  const bodyToCheck = willEat ? snake.value : snake.value.slice(0, -1)
  const hitSelf = bodyToCheck.some((segment) => samePosition(segment, nextHead))

  if (hitSelf) {
    endGame(false)
    return
  }

  const updatedSnake = [nextHead, ...snake.value]
  if (!willEat) {
    updatedSnake.pop()
  } else {
    score.value += 1
  }

  snake.value = updatedSnake

  if (willEat) {
    const newFood = getRandomFoodPosition(snake.value)
    if (!newFood) {
      food.value = null
      endGame(true)
      return
    }
    food.value = newFood
  }
}

function startLoop() {
  stopLoop()
  intervalId = setInterval(tick, TICK_MS)
}

function resetGame() {
  snake.value = INITIAL_SNAKE.map((segment) => ({ ...segment }))
  direction.value = { x: 1, y: 0 }
  nextDirection.value = { x: 1, y: 0 }
  score.value = 0
  isGameOver.value = false
  isWinner.value = false
  food.value = getRandomFoodPosition(snake.value)
  isRunning.value = true
  startLoop()
}

function onKeydown(event) {
  const map = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 }
  }

  const next = map[event.key]
  if (!next) return

  event.preventDefault()
  if (isOpposite(next, direction.value) || isOpposite(next, nextDirection.value)) return
  nextDirection.value = next

  if (!isRunning.value && !isGameOver.value && !isWinner.value) {
    startLoop()
    isRunning.value = true
  }
}

onMounted(() => {
  snake.value = INITIAL_SNAKE.map((segment) => ({ ...segment }))
  food.value = getRandomFoodPosition(snake.value)
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  stopLoop()
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <main class="layout">
    <section class="game-card">
      <header class="hud">
        <h1>Snake</h1>

        <div class="hud-row">
          <p class="score">Puntuación <strong>{{ score }}</strong></p>
          <button @click="resetGame">Nuevo juego</button>
        </div>

        <p class="status">{{ statusText }}</p>
      </header>

      <div class="board" :style="{ gridTemplateColumns: rowTemplate }">
        <div
          v-for="(cell, index) in cells"
          :key="index"
          class="cell"
          :class="[
            cell,
            {
              'head-up': cell === 'cell-head' && direction.y === -1,
              'head-down': cell === 'cell-head' && direction.y === 1,
              'head-left': cell === 'cell-head' && direction.x === -1,
              'head-right': cell === 'cell-head' && direction.x === 1
            }
          ]"
        />
      </div>

      <p class="help">Controles: ← ↑ ↓ →</p>
    </section>
  </main>
</template>

<style>
:root {
  color-scheme: light;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f4f6f8;
  color: #18202a;
}

#app {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
}

.layout {
  width: min(95vw, 580px);
}

.game-card {
  width: 100%;
  background: #ffffff;
  border: 1px solid #e6eaf0;
  border-radius: 22px;
  padding: 18px;
  display: grid;
  gap: 16px;
  box-shadow: 0 12px 30px rgba(16, 24, 40, 0.06);
}

h1 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.hud {
  display: grid;
  gap: 8px;
}

.hud-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.score,
.status,
.help {
  margin: 0;
}
.score {
  color: #4a5565;
  font-size: 0.94rem;
}

.score strong {
  margin-left: 6px;
  color: #1b2533;
}

.status {
  color: #64748b;
  font-size: 0.88rem;
  min-height: 1.15rem;
}

button {
  border: 1px solid #dce3ed;
  border-radius: 999px;
  padding: 8px 14px;
  font-weight: 600;
  cursor: pointer;
  background: #f8fafc;
  color: #1f2937;
  transition: all 0.15s ease;
}

button:hover {
  border-color: #b9c5d8;
  background: #f2f6fb;
}

.board {
  width: 100%;
  max-width: 520px;
  aspect-ratio: 1;
  display: grid;
  gap: 3px;
  padding: 9px;
  margin: 0 auto;
  background: #f8fafc;
  border: 1px solid #e6ebf2;
  border-radius: 14px;
}

.cell {
  position: relative;
  overflow: hidden;
  background: #ebf0f6;
  border-radius: 4px;
  transition: background 0.12s ease, transform 0.12s ease;
}

.cell-snake {
  background: linear-gradient(135deg, #2f8a42, #3fa958);
}

.cell-head {
  background: linear-gradient(135deg, #226d34, #2f9145);
  border-radius: 45% 45% 35% 35%;
  box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.14);
}

.cell-food {
  background: radial-gradient(circle at 30% 30%, #fdba74, #f97316 68%);
  border-radius: 50%;
  box-shadow: 0 0 0 1px rgba(194, 85, 12, 0.2);
}

.cell-head::before {
  content: '';
  position: absolute;
  top: 4px;
  left: 4px;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #f9fafb;
  box-shadow: 7px 0 0 #f9fafb;
}

.cell-head::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 4px;
  width: 8px;
  height: 2px;
  border-radius: 999px;
  background: #f87171;
  transform: translateX(-50%);
}

.head-up {
  transform: rotate(-90deg);
}

.head-down {
  transform: rotate(90deg);
}

.head-left {
  transform: rotate(180deg);
}

.head-right {
  transform: rotate(0deg);
}

.help {
  text-align: center;
  color: #64748b;
  font-size: 0.85rem;
}

@media (max-width: 520px) {
  .game-card {
    border-radius: 16px;
    padding: 14px;
  }

  h1 {
    font-size: 1.2rem;
  }
}
</style>
