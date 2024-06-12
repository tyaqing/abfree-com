import i18next from 'i18next'

import type {PreviewUi} from '@/types/interface'
import { toast } from '@/utils/message'

export function uploadPreCheck(preview: PreviewUi[], previewNames: string[]) {
  if (preview.length == 0) {
    toast(i18next.t('Select Image'), true)
    return false
  }
  if (preview.filter((pre) => pre.name == '').length > 0) {
    toast('Empty image file name', true)
    return false
  }
  if (previewNames.length != new Set(previewNames).size) {
    toast('Duplicate image file name', true)
    return false
  }
  return true
}

export function bytesToSize(bytes: number) {
  if (bytes === 0) return '-'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return parseFloat((bytes / Math.pow(k, i)).toFixed()) + '' + sizes[i]
}
