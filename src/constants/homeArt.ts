/**
 * 首页插画。题材对齐原型：丰收主视觉、芦柑、礼盒、果干、果酱、蜜饯、茶叶、蜂蜜、产区。
 * 上传真实图片后，用图片地址覆盖对应字段即可，不必改版式。
 */

function uri(svg: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.replace(/\s{2,}/g, ' ').trim())}`
}

function fruit(cx: number, cy: number, r: number) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#f39800"/>
    <circle cx="${cx - r * 0.28}" cy="${cy - r * 0.32}" r="${r * 0.22}" fill="#ffd27a" opacity="0.7"/>
    <path d="M${cx} ${cy - r} q ${r * 0.4} ${-r * 0.35} ${r * 0.7} ${-r * 0.15}" fill="none" stroke="#2f7d32" stroke-width="2"/>`
}

export const HOME_ART = {
  logo: uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <rect width="64" height="64" rx="14" fill="#fff4e5"/>
    ${fruit(32, 38, 16)}
    <path d="M34 20c6-8 16-8 18-2-6 1-12 6-18 2z" fill="#2f7d32"/>
  </svg>`),

  hero: uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 420">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fff6e4"/>
        <stop offset="1" stop-color="#ffd9a0"/>
      </linearGradient>
    </defs>
    <rect width="960" height="420" fill="url(#sky)"/>
    <circle cx="250" cy="70" r="36" fill="#ffe08a"/>
    <path d="M0 280 C160 220 280 300 460 250 C620 210 760 250 960 190 L960 420 L0 420Z" fill="#8fbf72"/>
    <path d="M0 320 C180 280 340 340 520 300 C700 260 820 310 960 270 L960 420 L0 420Z" fill="#6aa35a"/>
    <ellipse cx="760" cy="300" rx="120" ry="28" fill="#c9854a"/>
    <path d="M660 300 q20 70 100 78 q90 8 120-70 q-40 28-110 24 q-70-4-110-32z" fill="#e7c49a"/>
    ${fruit(720, 250, 36)}${fruit(770, 236, 40)}${fruit(820, 258, 34)}${fruit(748, 292, 28)}
    <path d="M790 190c18-22 40-18 44-4-16 2-30 16-44 4z" fill="#2f7d32"/>
    <rect x="0" y="0" width="520" height="420" fill="#fff6e8" opacity="0.72"/>
  </svg>`),

  bigFruit: uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220">
    <rect width="320" height="220" fill="#f6f1ea"/>
    ${fruit(150, 120, 62)}${fruit(210, 132, 48)}
    <path d="M168 52c22-26 48-22 52-6-20 4-36 18-52 6z" fill="#2f7d32"/>
  </svg>`),

  crate: uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220">
    <rect width="320" height="220" fill="#f6f1ea"/>
    <path d="M70 150 h180 l-16 40 H86z" fill="#e2b56a" stroke="#c48a3a"/>
    <path d="M78 162 h164 M82 174 h156" stroke="#c48a3a" stroke-width="2"/>
    ${fruit(130, 118, 28)}${fruit(168, 108, 32)}${fruit(206, 120, 26)}
  </svg>`),

  gift: uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220">
    <rect width="320" height="220" fill="#f6f1ea"/>
    <rect x="78" y="78" width="164" height="100" rx="6" fill="#f39800"/>
    <rect x="148" y="78" width="24" height="100" fill="#fff6e4"/>
    <path d="M160 78c-24-28-48-8-28 8h28c20-16 4-36-28-8" fill="none" stroke="#fff6e4" stroke-width="6"/>
    ${fruit(118, 70, 16)}${fruit(200, 66, 14)}
  </svg>`),

  freshBox: uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220">
    <rect width="320" height="220" fill="#f6f1ea"/>
    <rect x="70" y="120" width="180" height="58" rx="4" fill="#d7a15a"/>
    ${fruit(120, 108, 26)}${fruit(160, 96, 30)}${fruit(202, 110, 24)}
    <path d="M150 70c12-16 28-12 30-2-12 2-20 10-30 2z" fill="#2f7d32"/>
  </svg>`),

  dried: uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220">
    <rect width="320" height="220" fill="#f6f1ea"/>
    <path d="M110 50 h100 l16 130 H94z" fill="#f3e2c4" stroke="#d7b48a"/>
    <ellipse cx="160" cy="118" rx="36" ry="14" fill="#e07a00" transform="rotate(-18 160 118)"/>
    <ellipse cx="150" cy="140" rx="30" ry="12" fill="#f39800" transform="rotate(12 150 140)"/>
    <ellipse cx="176" cy="136" rx="26" ry="10" fill="#c86a12" transform="rotate(-8 176 136)"/>
  </svg>`),

  jam: uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220">
    <rect width="320" height="220" fill="#f6f1ea"/>
    <rect x="132" y="48" width="56" height="18" rx="3" fill="#c48a3a"/>
    <path d="M124 66 h72 v18 c0 40-12 78-36 78s-36-38-36-78z" fill="#f4f7f8" stroke="#d5dde0"/>
    <path d="M128 92 h64 v70 c0 28-10 48-32 48s-32-20-32-48z" fill="#e25b00"/>
    <rect x="140" y="108" width="40" height="22" rx="2" fill="#fff6e4"/>
  </svg>`),

  candy: uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220">
    <rect width="320" height="220" fill="#f6f1ea"/>
    <rect x="108" y="48" width="104" height="124" rx="8" fill="#fff" stroke="#f39800" stroke-width="4"/>
    <rect x="108" y="48" width="104" height="28" fill="#f39800"/>
    ${fruit(160, 120, 28)}
  </svg>`),

  tea: uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220">
    <rect width="320" height="220" fill="#f6f1ea"/>
    <rect x="126" y="46" width="68" height="16" rx="3" fill="#6a8f62"/>
    <rect x="118" y="62" width="84" height="110" rx="6" fill="#2f6b45"/>
    <rect x="132" y="86" width="56" height="36" rx="3" fill="#f6f1ea"/>
    <circle cx="160" cy="104" r="8" fill="#f39800"/>
  </svg>`),

  honey: uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220">
    <rect width="320" height="220" fill="#f6f1ea"/>
    <rect x="138" y="42" width="44" height="16" rx="3" fill="#e2b56a"/>
    <path d="M128 58 h64 l8 18 v78 c0 22-14 36-40 36s-40-14-40-36 V76z" fill="#f6c453" stroke="#e2a63a"/>
    <ellipse cx="160" cy="120" rx="22" ry="10" fill="#fff6d8" opacity="0.45"/>
  </svg>`),

  dapu: uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 180">
    <rect width="240" height="180" fill="#d7f0ea"/>
    <path d="M0 120 C40 80 80 90 120 70 C160 50 190 80 240 60 L240 180 L0 180Z" fill="#7dbe78"/>
    <path d="M0 145 C60 120 100 150 150 130 C190 116 210 130 240 120 L240 180 L0 180Z" fill="#5aa15d"/>
    ${fruit(70, 132, 8)}${fruit(96, 126, 8)}${fruit(150, 118, 8)}${fruit(176, 124, 8)}
  </svg>`),

  penghu: uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 180">
    <rect width="240" height="180" fill="#f8e7c4"/>
    <path d="M0 100 C50 40 90 70 130 48 C180 20 210 60 240 40 L240 180 L0 180Z" fill="#8fbf72"/>
    <path d="M20 150 q18-40 28-10 q10 24 22-6 q16 30 8 36z" fill="#2f7d32"/>
    <path d="M150 146 q20-48 32-8 q12 28 24-4 q14 26 6 34z" fill="#3f8f4a"/>
    ${fruit(48, 128, 7)}${fruit(182, 122, 7)}
  </svg>`),

  news: uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120">
    <rect width="160" height="120" fill="#efe6d6"/>
    <path d="M0 80 C30 50 50 70 80 48 C110 28 130 60 160 40 L160 120 L0 120Z" fill="#7dbe78"/>
    ${fruit(78, 78, 14)}
  </svg>`),

  origin: uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120">
    <rect width="160" height="120" fill="#f3e2c0"/>
    <path d="M0 70 L40 40 L70 62 L110 28 L160 66 L160 120 L0 120Z" fill="#6aa35a"/>
    <rect x="96" y="72" width="22" height="18" fill="#f6f1ea"/>
    <path d="M92 72 l15-12 15 12" fill="#e07a00"/>
  </svg>`),

  pile: uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
    <rect width="80" height="80" fill="none"/>
    ${fruit(28, 46, 16)}${fruit(48, 40, 18)}${fruit(58, 56, 12)}
  </svg>`),
}
