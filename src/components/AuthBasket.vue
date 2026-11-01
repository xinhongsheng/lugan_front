<script setup lang="ts">
/**
 * 竹篮芦柑与产区石碑。SVG 占位，后续可换成实拍抠图。
 */
const fruits = [
  { id: 'f1', cx: 150, cy: 176, r: 34 },
  { id: 'f2', cx: 198, cy: 158, r: 36 },
  { id: 'f3', cx: 248, cy: 168, r: 33 },
  { id: 'f4', cx: 292, cy: 188, r: 30 },
  { id: 'f5', cx: 128, cy: 214, r: 32 },
  { id: 'f6', cx: 176, cy: 206, r: 38 },
  { id: 'f7', cx: 230, cy: 214, r: 36 },
  { id: 'f8', cx: 108, cy: 248, r: 28 },
  { id: 'f9', cx: 250, cy: 250, r: 30 },
]
</script>

<template>
  <svg class="basket" viewBox="0 0 640 500" role="img" aria-label="竹篮装着永春芦柑，旁边石碑写着永春芦柑核心产区">
    <defs>
      <linearGradient id="auth-rock" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#f7f4ee" />
        <stop offset="48%" stop-color="#d9d3c7" />
        <stop offset="100%" stop-color="#b3ab9e" />
      </linearGradient>
      <radialGradient id="auth-orange" cx="34%" cy="30%" r="72%">
        <stop offset="0%" stop-color="#ffe3ad" />
        <stop offset="42%" stop-color="#ff8e20" />
        <stop offset="100%" stop-color="#de5200" />
      </radialGradient>
      <radialGradient id="auth-orange-deep" cx="32%" cy="28%" r="74%">
        <stop offset="0%" stop-color="#ffc56a" />
        <stop offset="50%" stop-color="#f26512" />
        <stop offset="100%" stop-color="#c43e00" />
      </radialGradient>
      <pattern id="auth-weave" width="18" height="12" patternUnits="userSpaceOnUse">
        <rect width="18" height="12" fill="#c4893f" />
        <path d="M0 6H18" stroke="#f3d7a4" stroke-width="5" />
        <path d="M0 0H18" stroke="#9a642c" stroke-width="2" />
        <path d="M5 0v12M13 0v12" stroke="#7a4c22" stroke-width="1.2" opacity="0.55" />
      </pattern>
      <clipPath id="auth-basket-clip">
        <path d="M78 248h292l-28 176c-40 28-196 28-236 0L78 248Z" />
      </clipPath>
    </defs>

    <ellipse cx="250" cy="470" rx="170" ry="16" fill="#000" opacity="0.12" />

    <path
      fill="url(#auth-rock)"
      d="M430 78c62-36 168-10 176 78 8 92-18 196-62 250-36 44-118 36-146-28-30-70-28-210 32-300Z"
    />
    <path
      d="M470 150c28 20 36 70 18 112"
      fill="none"
      stroke="#fff"
      stroke-width="3"
      opacity="0.35"
      stroke-linecap="round"
    />
    <ellipse cx="455" cy="392" rx="46" ry="14" fill="#6d9a58" />
    <ellipse cx="500" cy="404" rx="28" ry="10" fill="#87b36c" />

    <g fill="#d62828" font-family="PingFang SC, Microsoft YaHei, sans-serif" font-size="30" font-weight="700">
      <text x="498" y="168">永</text>
      <text x="498" y="206">春</text>
      <text x="498" y="244">芦</text>
      <text x="498" y="282">柑</text>
      <text x="542" y="188">核</text>
      <text x="542" y="226">心</text>
      <text x="542" y="264">产</text>
      <text x="542" y="302">区</text>
    </g>

    <g clip-path="url(#auth-basket-clip)">
      <rect x="70" y="240" width="310" height="210" fill="url(#auth-weave)" />
    </g>
    <path
      d="M78 248h292l-28 176c-40 28-196 28-236 0L78 248Z"
      fill="none"
      stroke="#7c4e22"
      stroke-width="7"
    />
    <ellipse cx="224" cy="246" rx="158" ry="28" fill="#e2b56b" stroke="#7c4e22" stroke-width="5" />
    <ellipse cx="224" cy="246" rx="132" ry="16" fill="#c8883c" />

    <g v-for="fruit in fruits" :key="fruit.id">
      <circle :cx="fruit.cx" :cy="fruit.cy" :r="fruit.r" fill="url(#auth-orange)" />
      <ellipse
        :cx="fruit.cx - fruit.r * 0.28"
        :cy="fruit.cy - fruit.r * 0.32"
        :rx="fruit.r * 0.22"
        :ry="fruit.r * 0.12"
        fill="#fff"
        opacity="0.35"
      />
    </g>
    <g>
      <circle cx="300" cy="236" r="40" fill="url(#auth-orange-deep)" />
      <circle cx="300" cy="236" r="33" fill="#ffe6c4" />
      <circle cx="300" cy="236" r="7" fill="#fff8ee" />
      <path
        d="M300 203v66M267 236h66M276 212l48 48M324 212l-48 48"
        fill="none"
        stroke="#f08a2c"
        stroke-width="2"
      />
      <circle cx="300" cy="236" r="40" fill="none" stroke="#fff4e4" stroke-width="5" />
      <ellipse cx="286" cy="204" rx="14" ry="6" fill="#3c9a45" transform="rotate(-30 286 204)" />
    </g>
    <ellipse cx="168" cy="132" rx="16" ry="7" fill="#3d9a46" transform="rotate(-24 168 132)" />
    <ellipse cx="214" cy="118" rx="18" ry="7" fill="#2f7d3c" transform="rotate(18 214 118)" />
  </svg>
</template>
