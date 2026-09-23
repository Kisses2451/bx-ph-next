export interface NormalizeLogoOptions {
  size?: number
  padding?: number
  maxUpscale?: number
}

export interface NormalizedLogo {
  blob: Blob
  width: number
  height: number
  format: 'webp' | 'png'
  warning?: string
}

const SUPPORTED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const LOW_RESOLUTION_WARNING = 'Low resolution, the logo may look blurry.'

function loadBitmap(file: File) {
  return createImageBitmap(file, { imageOrientation: 'from-image' })
}

async function canvasBlob(canvas: HTMLCanvasElement, type: string, quality?: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality))
}

export async function normalizeLogoToSquare(
  file: File,
  { size = 800, padding = 0.08, maxUpscale = 2 }: NormalizeLogoOptions = {},
): Promise<NormalizedLogo> {
  if (!SUPPORTED_TYPES.has(file.type)) {
    throw new Error('Only JPG, PNG, and WebP images are accepted. SVG and GIF files are not supported.')
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Logo files must be 10 MB or smaller.')
  }

  const bitmap = await loadBitmap(file)
  const sourceCanvas = document.createElement('canvas')
  sourceCanvas.width = bitmap.width
  sourceCanvas.height = bitmap.height
  const sourceContext = sourceCanvas.getContext('2d', { willReadFrequently: true })
  if (!sourceContext) {
    bitmap.close()
    throw new Error('Unable to read the logo image.')
  }
  sourceContext.drawImage(bitmap, 0, 0)
  const pixels = sourceContext.getImageData(0, 0, bitmap.width, bitmap.height).data
  let hasTransparency = false
  let left = bitmap.width
  let top = bitmap.height
  let right = -1
  let bottom = -1
  for (let y = 0; y < bitmap.height; y += 1) {
    for (let x = 0; x < bitmap.width; x += 1) {
      const alpha = pixels[(y * bitmap.width + x) * 4 + 3]
      if (alpha < 255) hasTransparency = true
      if (alpha > 8) {
        left = Math.min(left, x)
        top = Math.min(top, y)
        right = Math.max(right, x)
        bottom = Math.max(bottom, y)
      }
    }
  }
  bitmap.close()

  if (!hasTransparency || right < 0) {
    left = 0
    top = 0
    right = sourceCanvas.width - 1
    bottom = sourceCanvas.height - 1
  }

  const contentWidth = right - left + 1
  const contentHeight = bottom - top + 1
  const available = size * (1 - padding * 2)
  const scale = Math.min(available / Math.max(contentWidth, contentHeight), maxUpscale)
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Unable to create the normalized logo.')
  context.clearRect(0, 0, size, size)
  const drawWidth = contentWidth * scale
  const drawHeight = contentHeight * scale
  context.drawImage(sourceCanvas, left, top, contentWidth, contentHeight, (size - drawWidth) / 2, (size - drawHeight) / 2, drawWidth, drawHeight)

  let blob = await canvasBlob(canvas, 'image/webp', 0.9)
  let format: 'webp' | 'png' = 'webp'
  if (!blob || blob.type !== 'image/webp') {
    blob = await canvasBlob(canvas, 'image/png')
    format = 'png'
  } else if (blob.size > 300 * 1024) {
    for (const quality of [0.85, 0.8, 0.75]) {
      const candidate = await canvasBlob(canvas, 'image/webp', quality)
      if (candidate && candidate.size <= 300 * 1024) {
        blob = candidate
        break
      }
      if (candidate) blob = candidate
    }
  }
  if (!blob) throw new Error('Unable to encode the normalized logo.')

  return {
    blob,
    width: size,
    height: size,
    format,
    warning: Math.max(bitmap.width, bitmap.height) < 400 ? LOW_RESOLUTION_WARNING : undefined,
  }
}
