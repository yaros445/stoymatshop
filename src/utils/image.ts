export function getImageUrl(id: string, width: number, quality = 80): string {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=${quality}`
}
