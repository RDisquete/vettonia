import { toast } from 'sonner'

const FESTIVAL_DATE = new Date('2026-07-17T00:00:00')
const FESTIVAL_NAME = 'Vettonia 2026'

function getCountdown(): string {
  const now = new Date()
  const diff = FESTIVAL_DATE.getTime() - now.getTime()
  if (diff <= 0) return '¡Vettonia 2026 ya está aquí! 🎶'
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  if (days > 0) return `Quedan ${days} días para Vettonia 2026 🎶`
  return `Quedan ${hours} horas para Vettonia 2026 🎶`
}

function makeFile(blob: Blob, name: string): File {
  return new File([blob], name, { type: blob.type })
}

async function blobFromUrl(url: string): Promise<Blob | null> {
  try {
    const res = await fetch(url)
    return await res.blob()
  } catch {
    return null
  }
}

export async function shareImage(blob: Blob, filename: string, title?: string) {
  const file = makeFile(blob, filename)
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title, text: title })
      return
    } catch {}
  }
  try {
    await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })])
    toast.success('Imagen copiada al portapapeles')
  } catch {
    toast.error('No se pudo compartir la imagen')
  }
}

export async function shareUrl(url: string, filename: string, title?: string) {
  const blob = await blobFromUrl(url)
  if (blob) await shareImage(blob, filename, title)
}

export async function shareText(text: string) {
  if (navigator.share) {
    try {
      await navigator.share({ text })
      return
    } catch {}
  }
  try {
    await navigator.clipboard.writeText(text)
    toast.success('Texto copiado al portapapeles')
  } catch {
    toast.error('No se pudo compartir el texto')
  }
}

export function shareCountdown() {
  const text = `${getCountdown()}\n\n¡Yo voy! ¿Y tú?\n\n#Vettonia2026 #Festival`
  return shareText(text)
}
