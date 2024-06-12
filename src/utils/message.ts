import { nanoid } from 'nanoid'

import {type ExportDefault, Format, type PreviewUi, UiMessageType } from '@/types/interface'
/**
 * 发送消息到沙箱
 * @param messageType
 * @param data
 */
export function sendToSandBox<T>(messageType: UiMessageType, data?: any): Promise<T> {
  const messageId = nanoid()
  return new Promise((resolve) => {
    parent.postMessage(
      {
        pluginMessage: {
          type: messageType,
          data,
          messageId,
        },
        pluginId: import.meta.env.PUBLIC_PLUGIN_ID as string,
      },
      '*',
    )
    const handlerMessage = (event: MessageEvent<any>) => {
      // 这里可能会有其他的message，所以需要判断是否是我们需要的message
      if (!event?.data?.pluginMessage) return
      const { data, messageId: _messageId } = event.data.pluginMessage
      if (messageId === _messageId) {
        resolve(data)
        window.removeEventListener('message', handlerMessage)
      }
      // timeout 10s remove listener
      setTimeout(() => {
        window.removeEventListener('message', handlerMessage)
      }, 10000)
    }
    window.addEventListener('message', handlerMessage)
  })
}

/**
 * 消息提示
 * @param message
 * @param isError
 */
export function toast(message: string, isError = false) {
  sendToSandBox(isError ? UiMessageType.ERROR : UiMessageType.MESSAGE, message)
}

/**
 * 获取storage
 * @param key
 */
export function storageGet<T>(key: string): Promise<T> {
  return sendToSandBox(UiMessageType.STORAGE_GET, key)
}

/**
 * 设置storage
 * @param key
 * @param value
 */
export function storageSet(key: string, value: any) {
  sendToSandBox(UiMessageType.STORAGE_SET, { key, value })
  return Promise.resolve()
}

/**
 * 获取figma原始图片
 * @param preview
 * @param format
 * @param scale
 */
export async function getExportFile(
  preview: PreviewUi[],
  format: Format,
  scale: number,
): Promise<Uint8Array> {
  const exports = await sendToSandBox<ExportDefault[]>(UiMessageType.UPLOAD, {
    preview,
    format,
    scale,
  })
  if (exports.length < 0) {
    toast('exports.length < 0', true)
    throw new Error('exports.length < 0')
  }
  return exports[0].buffer
}
