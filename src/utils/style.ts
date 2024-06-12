import { Format } from '@/types/interface.ts'

export const tagColor = (mimeType: string) => {
  switch (mimeType) {
    case Format.PNG:
      return 'pink'
    case Format.JPG:
      return 'teal'
    case Format.SVG:
      return 'purple'
    case Format.WEBP:
      return 'green'
    case Format.AVIF:
      return 'orange'
    default:
      return 'cyan'
  }
}
