import { toast } from 'sonner'

const FESTIVAL_DATE = new Date('2027-10-08T00:00:00')
const FESTIVAL_NAME = 'Vettonia 2027'

function getCountdown(): string {
  const now = new Date()
  const diff = FESTIVAL_DATE.getTime() - now.getTime()
  if (diff <= 0) return `¡${FESTIVAL_NAME} ya está aquí! 🎶`
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  if (days > 0) return `Quedan ${days} días para ${FESTIVAL_NAME} 🎶`
  return `Quedan ${hours} horas para ${FESTIVAL_NAME} 🎶`
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
    } catch { console.warn('[share] share cancelled by user') }
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
    } catch (e) { console.warn('[share] navigator.share cancelled by user', e) }
  }
  try {
    await navigator.clipboard.writeText(text)
    toast.success('Texto copiado al portapapeles')
  } catch {
    toast.error('No se pudo compartir el texto')
  }
}

export function shareCountdown() {
  const text = `${getCountdown()}\n\n¡Yo voy! ¿Y tú?\n\n#Vettonia2027 #Festival`
  return shareText(text)
}
