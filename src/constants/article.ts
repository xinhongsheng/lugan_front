export const ARTICLE_TYPE_ENUM = ['notice', 'news', 'origin'] as const

export const ARTICLE_TYPE_MAP: Record<(typeof ARTICLE_TYPE_ENUM)[number], string> = {
  notice: '平台公告',
  news: '产业资讯',
  origin: '产地介绍',
}

export const ARTICLE_TYPE_OPTIONS = [
  { label: '平台公告', value: 'notice' },
  { label: '产业资讯', value: 'news' },
  { label: '产地介绍', value: 'origin' },
]

export const ARTICLE_TYPE_COLOR_MAP: Record<(typeof ARTICLE_TYPE_ENUM)[number], string> = {
  notice: 'orange',
  news: 'green',
  origin: 'gold',
}
