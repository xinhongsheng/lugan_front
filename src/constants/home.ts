/**
 * 本地生成的产地插画（SVG data URI）。
 * 不依赖任何外部图片 CDN，离线可用；后端返回真实图片时优先用图片。
 */

type Palette = {
  sky: [string, string]
  hill: [string, string, string]
  fruit: [string, string]
}

const PALETTES: Palette[] = [
  { sky: ['#eaf4dc', '#c7e0ac'], hill: ['#8cbf63', '#5d9a42', '#3a7a2c'], fruit: ['#f0952f', '#d9791b'] },
  { sky: ['#fdf3e2', '#eed4a8'], hill: ['#d8a659', '#b47c33', '#8b5a1e'], fruit: ['#ef8f26', '#cf6c15'] },
  { sky: ['#edf5ef', '#cbe4d2'], hill: ['#7fba88', '#519a64', '#347a49'], fruit: ['#f3a03c', '#d97c22'] },
  { sky: ['#f4f0fa', '#dcd4ec'], hill: ['#a294cb', '#7b6aae', '#584a86'], fruit: ['#f2a04a', '#d9772a'] },
]

function makeRandom(seed: number) {
  let state = (seed + 1) * 7919
  return () => {
    state = (state * 1103515245 + 12345) % 2147483648
    return state / 2147483648
  }
}

function toDataUri(svg: string) {
  const compact = svg.replace(/\s{2,}/g, ' ').trim()
  const bytes = new TextEncoder().encode(compact)
  let binary = ''
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return `data:image/svg+xml;base64,${btoa(binary)}`
}

/** 横向产地风景：山丘 + 果树 + 果实 */
function scenePhoto(seed: number) {
  const palette = PALETTES[seed % PALETTES.length]
  const random = makeRandom(seed)
  const horizonA = 250 + random() * 30
  const horizonB = 300 + random() * 30
  const sunX = 120 + random() * 360
  const sunY = 70 + random() * 40

  const fruits: string[] = []
  for (let i = 0; i < 6; i += 1) {
    const cx = 40 + random() * 520
    const cy = 300 + random() * 82
    const r = 12 + random() * 9
    const color = i % 2 === 0 ? palette.fruit[0] : palette.fruit[1]
    fruits.push(`<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${r.toFixed(0)}" fill="${color}"/>`)
    fruits.push(
      `<circle cx="${(cx - r * 0.3).toFixed(0)}" cy="${(cy - r * 0.35).toFixed(0)}" r="${(r * 0.22).toFixed(1)}" fill="#ffffff" opacity="0.45"/>`,
    )
    fruits.push(
      `<ellipse cx="${(cx + r * 0.5).toFixed(0)}" cy="${(cy - r * 0.9).toFixed(0)}" rx="${(r * 0.5).toFixed(0)}" ry="${(r * 0.22).toFixed(0)}" fill="#4c8a3f" transform="rotate(-28 ${(cx + r * 0.5).toFixed(0)} ${(cy - r * 0.9).toFixed(0)})"/>`,
    )
  }

  // 地平线上的果园树丛
  const trees: string[] = []
  for (let i = 0; i < 9; i += 1) {
    const tx = -20 + i * 72 + random() * 26
    const ty = horizonB - 6 + random() * 16
    const scale = 0.7 + random() * 0.6
    trees.push(
      `<rect x="${(tx - 2 * scale).toFixed(0)}" y="${ty.toFixed(0)}" width="${(4 * scale).toFixed(0)}" height="${(16 * scale).toFixed(0)}" fill="#4a6b33"/>`,
    )
    trees.push(
      `<circle cx="${tx.toFixed(0)}" cy="${(ty - 2).toFixed(0)}" r="${(16 * scale).toFixed(0)}" fill="${palette.hill[2]}" opacity="0.92"/>`,
    )
    trees.push(
      `<circle cx="${(tx - 11 * scale).toFixed(0)}" cy="${(ty + 4).toFixed(0)}" r="${(11 * scale).toFixed(0)}" fill="${palette.hill[2]}" opacity="0.82"/>`,
    )
    trees.push(
      `<circle cx="${(tx + 12 * scale).toFixed(0)}" cy="${(ty + 3).toFixed(0)}" r="${(12 * scale).toFixed(0)}" fill="${palette.hill[2]}" opacity="0.86"/>`,
    )
  }

  return toDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${palette.sky[0]}"/>
          <stop offset="1" stop-color="${palette.sky[1]}"/>
        </linearGradient>
        <radialGradient id="sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stop-color="#ffffff" stop-opacity="0.9"/>
          <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="vig" cx="0.5" cy="0.45" r="0.72">
          <stop offset="0.55" stop-color="#000000" stop-opacity="0"/>
          <stop offset="1" stop-color="#0b2413" stop-opacity="0.28"/>
        </radialGradient>
      </defs>
      <rect width="600" height="400" fill="url(#sky)"/>
      <circle cx="${sunX.toFixed(0)}" cy="${sunY.toFixed(0)}" r="92" fill="url(#sun)"/>
      <path d="M0 ${horizonA.toFixed(0)} Q150 ${(horizonA - 55).toFixed(0)} 300 ${horizonA.toFixed(0)} T600 ${(horizonA - 25).toFixed(0)} V400 H0 Z" fill="${palette.hill[0]}" opacity="0.75"/>
      <path d="M0 ${horizonB.toFixed(0)} Q180 ${(horizonB - 48).toFixed(0)} 360 ${(horizonB + 12).toFixed(0)} T600 ${(horizonB - 8).toFixed(0)} V400 H0 Z" fill="${palette.hill[1]}" opacity="0.95"/>
      ${trees.join('')}
      <path d="M0 356 Q200 316 400 348 T600 336 V400 H0 Z" fill="${palette.hill[2]}"/>
      <path d="M0 386 Q220 356 420 380 T600 372 V400 H0 Z" fill="#2f5c25" opacity="0.55"/>
      ${fruits.join('')}
      <rect width="600" height="400" fill="url(#vig)"/>
    </svg>
  `)
}

/** 方形商品占位图：柔和底色 + 果实特写 */
function tilePhoto(seed: number) {
  const palette = PALETTES[(seed + 1) % PALETTES.length]
  const random = makeRandom(seed + 31)
  const count = 1 + (seed % 3)

  const items: string[] = []
  for (let i = 0; i < count; i += 1) {
    const r = (i === 0 ? 58 : 34) + random() * 12
    const cx = 150 + (random() - 0.5) * (i === 0 ? 46 : 150)
    const cy = 168 + (random() - 0.5) * (i === 0 ? 34 : 90)
    const opacity = i === 0 ? 1 : 0.92
    items.push(
      `<ellipse cx="${cx.toFixed(0)}" cy="${(cy + r * 0.92).toFixed(0)}" rx="${(r * 0.92).toFixed(0)}" ry="${(r * 0.16).toFixed(0)}" fill="${palette.hill[2]}" opacity="0.28"/>`,
    )
    items.push(
      `<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${r.toFixed(0)}" fill="url(#fruit)" opacity="${opacity}"/>`,
    )
    items.push(
      `<circle cx="${(cx - r * 0.32).toFixed(0)}" cy="${(cy - r * 0.36).toFixed(0)}" r="${(r * 0.17).toFixed(0)}" fill="#ffffff" opacity="0.48"/>`,
    )
    items.push(
      `<ellipse cx="${(cx + r * 0.3).toFixed(0)}" cy="${(cy - r * 0.94).toFixed(0)}" rx="${(r * 0.4).toFixed(0)}" ry="${(r * 0.15).toFixed(0)}" fill="#4c8a3f" transform="rotate(-24 ${(cx + r * 0.3).toFixed(0)} ${(cy - r * 0.94).toFixed(0)})"/>`,
    )
  }

  return toDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
      <defs>
        <radialGradient id="bg" cx="0.5" cy="0.35" r="0.8">
          <stop offset="0" stop-color="${palette.sky[0]}"/>
          <stop offset="1" stop-color="${palette.hill[0]}"/>
        </radialGradient>
        <radialGradient id="fruit" cx="0.34" cy="0.28" r="0.82">
          <stop offset="0" stop-color="${palette.fruit[0]}"/>
          <stop offset="1" stop-color="${palette.fruit[1]}"/>
        </radialGradient>
      </defs>
      <rect width="300" height="300" fill="url(#bg)"/>
      ${items.join('')}
    </svg>
  `)
}

export const HOME_PHOTOS = {
  grove: scenePhoto(0),
  harvest: scenePhoto(1),
  poster: scenePhoto(2),
  market: scenePhoto(3),
  crate: tilePhoto(0),
  slice: tilePhoto(1),
  basket: tilePhoto(2),
  dried: tilePhoto(3),
}

export const HOME_PHOTO_LIST = [
  tilePhoto(0),
  tilePhoto(1),
  tilePhoto(2),
  tilePhoto(3),
  tilePhoto(4),
  tilePhoto(5),
  tilePhoto(6),
  tilePhoto(7),
]

export function homePhoto(index: number) {
  const list = HOME_PHOTO_LIST
  const safeIndex = ((index % list.length) + list.length) % list.length
  return list[safeIndex]
}
