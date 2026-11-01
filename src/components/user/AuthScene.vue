<script setup lang="ts">
/**
 * 登录页果园背景。SVG 占位，后续整张替换为实拍。
 */
const trees = [
  { id: 1, x: 24, y: 468, s: 1.2 },
  { id: 2, x: 86, y: 508, s: 0.78 },
  { id: 3, x: 140, y: 452, s: 1.32 },
  { id: 4, x: 210, y: 512, s: 0.7 },
  { id: 5, x: 248, y: 470, s: 1.05 },
  { id: 6, x: 320, y: 500, s: 0.86 },
  { id: 7, x: 378, y: 446, s: 1.18 },
  { id: 8, x: 450, y: 488, s: 0.74 },
  { id: 9, x: 500, y: 458, s: 1.02 },
  { id: 10, x: 620, y: 492, s: 0.8 },
  { id: 11, x: 700, y: 450, s: 1.1 },
  { id: 12, x: 780, y: 500, s: 0.72 },
  { id: 13, x: 860, y: 462, s: 0.98 },
  { id: 14, x: 960, y: 488, s: 0.76 },
  { id: 15, x: 1048, y: 448, s: 1.08 },
  { id: 16, x: 1140, y: 482, s: 0.74 },
  { id: 17, x: 1230, y: 454, s: 0.96 },
  { id: 18, x: 1320, y: 490, s: 0.7 },
  { id: 19, x: 1390, y: 458, s: 0.88 },
  { id: 20, x: 180, y: 400, s: 0.55 },
  { id: 21, x: 280, y: 388, s: 0.48 },
  { id: 22, x: 390, y: 396, s: 0.52 },
  { id: 23, x: 560, y: 392, s: 0.46 },
  { id: 24, x: 740, y: 384, s: 0.5 },
  { id: 25, x: 920, y: 398, s: 0.44 },
  { id: 26, x: 1100, y: 386, s: 0.5 },
  { id: 27, x: 1260, y: 400, s: 0.42 },
]

const canopy = [
  { id: 'a', x: 20, y: 8, rx: 78, ry: 34, rot: -18, fill: '#1c5c30' },
  { id: 'b', x: 110, y: 24, rx: 64, ry: 28, rot: 12, fill: '#2f7d3d' },
  { id: 'c', x: 186, y: 6, rx: 52, ry: 26, rot: -8, fill: '#174f28' },
  { id: 'd', x: 250, y: 30, rx: 70, ry: 24, rot: 20, fill: '#3d9148' },
  { id: 'e', x: 1180, y: 10, rx: 70, ry: 30, rot: 16, fill: '#1d6232' },
  { id: 'f', x: 1288, y: 28, rx: 84, ry: 32, rot: -14, fill: '#2a7540' },
  { id: 'g', x: 1390, y: 4, rx: 60, ry: 28, rot: 8, fill: '#164c26' },
]

const hanging = [
  { id: 'h1', x: 78, y: 58, r: 15 },
  { id: 'h2', x: 124, y: 78, r: 12 },
  { id: 'h3', x: 168, y: 48, r: 16 },
  { id: 'h4', x: 214, y: 86, r: 11 },
  { id: 'h5', x: 1248, y: 62, r: 14 },
  { id: 'h6', x: 1310, y: 84, r: 17 },
  { id: 'h7', x: 1372, y: 52, r: 12 },
]
</script>

<template>
  <div class="scene-layer">
    <svg class="scene" viewBox="0 0 1440 720" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="auth-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#8ec8ea" />
          <stop offset="42%" stop-color="#d7eef6" />
          <stop offset="100%" stop-color="#f4f7f1" />
        </linearGradient>
        <linearGradient id="auth-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#e7f1f4" />
          <stop offset="100%" stop-color="#b7cdc8" />
        </linearGradient>
        <linearGradient id="auth-mid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#9ebda8" />
          <stop offset="100%" stop-color="#6e9a78" />
        </linearGradient>
        <linearGradient id="auth-near" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#5f935f" />
          <stop offset="100%" stop-color="#3d7544" />
        </linearGradient>
        <linearGradient id="auth-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#e7e0d2" />
          <stop offset="100%" stop-color="#d5cbb8" />
        </linearGradient>
        <radialGradient id="auth-fruit" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#ffe0a6" />
          <stop offset="45%" stop-color="#ff8c1e" />
          <stop offset="100%" stop-color="#e25500" />
        </radialGradient>
        <radialGradient id="auth-sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.85" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
        </radialGradient>
        <linearGradient id="auth-scrim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#0c2816" stop-opacity="0.5" />
          <stop offset="34%" stop-color="#0c2816" stop-opacity="0.22" />
          <stop offset="58%" stop-color="#0c2816" stop-opacity="0" />
        </linearGradient>
      </defs>

      <rect width="1440" height="720" fill="url(#auth-sky)" />
      <ellipse cx="760" cy="210" rx="260" ry="90" fill="url(#auth-sun)" />

      <path
        fill="#d7e6ef"
        d="M0 268 90 214 170 250 280 168 390 236 510 150 640 228 790 142 930 220 1060 160 1180 230 1310 176 1440 214V430H0Z"
      />
      <path
        fill="#b7cfc6"
        d="M0 332 140 286 250 338 390 248 530 322 690 236 840 318 1000 240 1160 312 1320 250 1440 300V490H0Z"
      />
      <path
        fill="url(#auth-mid)"
        d="M0 392 180 348 330 410 520 332 700 404 880 326 1060 396 1260 338 1440 378V560H0Z"
      />
      <path
        fill="url(#auth-near)"
        d="M0 468 210 424 390 492 620 418 840 486 1060 412 1280 474 1440 430V640H0Z"
      />

      <g fill="#2f6a38" opacity="0.35">
        <path d="M0 500c180-20 320 16 520-8 200-24 300 20 520-4 160-18 260 12 400 0v28H0v-16Z" />
        <path d="M0 536c220-18 340 14 560-10 210-22 280 18 500-6 140-14 240 10 380 2v24H0v-10Z" />
      </g>

      <g v-for="tree in trees" :key="tree.id" :transform="`translate(${tree.x} ${tree.y}) scale(${tree.s})`">
        <rect x="-3" y="16" width="6" height="18" rx="1.5" fill="#6a4328" />
        <ellipse cx="0" cy="8" rx="22" ry="16" fill="#21733a" />
        <ellipse cx="-9" cy="2" rx="13" ry="10" fill="#3f9848" />
        <ellipse cx="10" cy="4" rx="11" ry="9" fill="#185e2e" />
        <circle cx="-8" cy="-2" r="3.3" fill="url(#auth-fruit)" />
        <circle cx="7" cy="0" r="2.8" fill="#f26a12" />
        <circle cx="0" cy="10" r="2.5" fill="#ffb03a" />
      </g>

      <path fill="url(#auth-ground)" d="M0 575c240-40 420 20 700-16 220-28 420 24 740-8v169H0V575Z" />
      <path fill="#cfc4b0" d="M180 640c160-28 260 10 420-18 180-32 300 16 520-10 120-14 200 8 320 4v104H180V640Z" />
      <path
        fill="#e7dfd2"
        opacity="0.7"
        d="M520 700c40-70 90-120 150-150 70-34 40-8 90 20 40 22 30 70-20 110-70 54-160 48-220 20Z"
      />

      <g v-for="leaf in canopy" :key="leaf.id">
        <ellipse
          :cx="leaf.x"
          :cy="leaf.y"
          :rx="leaf.rx"
          :ry="leaf.ry"
          :fill="leaf.fill"
          :transform="`rotate(${leaf.rot} ${leaf.x} ${leaf.y})`"
        />
      </g>
      <g v-for="fruit in hanging" :key="fruit.id">
        <path
          :d="`M${fruit.x} 0 V${fruit.y - fruit.r}`"
          fill="none"
          stroke="#2f6a34"
          stroke-width="2"
        />
        <circle :cx="fruit.x" :cy="fruit.y" :r="fruit.r" fill="url(#auth-fruit)" />
        <ellipse :cx="fruit.x - 6" :cy="fruit.y - fruit.r + 2" rx="7" ry="3" fill="#3d9a46" />
      </g>

      <rect width="1440" height="720" fill="url(#auth-scrim)" />
    </svg>
  </div>
</template>

<style scoped>
.scene-layer {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.scene {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
