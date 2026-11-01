/**
 * Taste Skill 氛围图与装箱签文案。
 * 产品图不可伪造：商品位用后端封面或内联 SVG 果实；下列为产地世界照片（Unsplash via picsum，已下载到 public/taste）。
 */

export const TASTE_PHOTOS = {
  soil: {
    src: '/taste/farm-808.jpg',
    alt: '翻耕田埂与绿野',
    credit: 'elizabeth lies / Unsplash',
  },
  grapes: {
    src: '/taste/farm-75.jpg',
    alt: '藤上果实与叶片',
    credit: 'Jassy Onyae / Unsplash',
  },
  hay: {
    src: '/taste/farm-85.jpg',
    alt: '田野上的干草车',
    credit: 'Gozha Net / Unsplash',
  },
  grass: {
    src: '/taste/farm-112.jpg',
    alt: '金黄草穗与树线',
    credit: 'Zugr / Unsplash',
  },
  tea: {
    src: '/taste/farm-915.jpg',
    alt: '山坡茶田层叠',
    credit: 'McDobbie Hu / Unsplash',
  },
  rows: {
    src: '/taste/farm-955.jpg',
    alt: '航拍农田条纹',
    credit: 'Matt Benson / Unsplash',
  },
  hands: {
    src: '/taste/farm-674.jpg',
    alt: '双手捧起果实',
    credit: 'Maja Petric / Unsplash',
  },
  spruce: {
    src: '/taste/farm-785.jpg',
    alt: '双手捧着嫩绿枝尖',
    credit: 'Jean Lakosnyk / Unsplash',
  },
} as const

export const TASTE_ROOM_BG = '/taste/farm-808.jpg'

export const TASTE_CREDITS =
  '氛围摄影：elizabeth lies、Jassy Onyae、Gozha Net、Zugr、McDobbie Hu、Matt Benson、Maja Petric、Jean Lakosnyk（Unsplash）。商品摄影待替换。'

/** 内联 SVG：一枚芦柑，作商品缺省封面，非摄影假扮 */
export function luganFruitSvg(seed = 0) {
  const hue = 28 + (seed % 5) * 3
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320" role="img">
  <rect width="320" height="320" fill="#e3e1dc"/>
  <circle cx="160" cy="178" r="88" fill="hsl(${hue} 78% 52%)"/>
  <circle cx="132" cy="150" r="22" fill="hsl(${hue} 78% 62%)" opacity="0.35"/>
  <path d="M160 78c0-28 18-46 46-46" fill="none" stroke="#2a5a3a" stroke-width="10" stroke-linecap="round"/>
  <path d="M166 62c16-14 40-15 54-5-9 17-32 26-54 21z" fill="#2a5a3a"/>
  <text x="160" y="300" text-anchor="middle" fill="#1f2b4d" font-family="sans-serif" font-size="14" opacity="0.45">永春芦柑</text>
</svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
