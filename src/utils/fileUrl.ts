export function fileUrl(path?: unknown) {
  const value = path === undefined || path === null ? '' : String(path)
  if (!value) {
    return ''
  }
  if (value.startsWith('http') || value.startsWith('data:') || value.startsWith('blob:')) {
    return value
  }
  return `${import.meta.env.VITE_API_BASE_URL || ''}${value}`
}
