export function resolveCafeImage(image) {
  if (!image) return null

  const raw = String(image).trim()
  if (!raw) return null

  if (/^data:image\//i.test(raw)) return raw

  if (/\.(jpeg|jpg|png|gif|webp|svg|bmp)(?:\?|$)/i.test(raw) && !raw.includes('google.com/maps')) {
    return raw
  }

  const extractDirect = (value) => {
    const directMatch = value.match(/https?:\/\/lh[35]\.googleusercontent\.com[^\s"'<>)]+/i)
    return directMatch ? directMatch[0] : null
  }

  if (raw.includes('lh3.googleusercontent.com') || raw.includes('lh5.googleusercontent.com')) {
    const direct = extractDirect(raw)
    if (direct) return direct
  }

  try {
    const decoded = decodeURIComponent(raw)
    const direct = extractDirect(decoded)
    if (direct) return direct
  } catch (error) {
    // ignore malformed escapes and fall through
  }

  return null
}

export function resolveCafeImageSource(cafe, apiBase) {
  const directImage = resolveCafeImage(cafe?.images?.[0])
  if (directImage) return directImage

  if (!apiBase) return null

  const name = cafe?.name || 'Cafe'
  const address = cafe?.location?.address || 'Phnom Penh'
  return `${apiBase}/api/google/photo?query=${encodeURIComponent(`${name} ${address}`)}`
}