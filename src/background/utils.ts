import { Preview } from '../types/interface'

/** 设置一个前缀 */
const fileKey: string = figma.fileKey != undefined ? `${figma.fileKey}_` : ''

/**
 * 获取存储数据
 * @param key
 */
export const getData = (key: string): Promise<any | undefined> => {
  return figma.clientStorage.getAsync(fileKey + key)
}
/**
 * 设置存储数据
 * @param key
 * @param data
 */
export const setData = (key: string, data: any): Promise<void> => {
  return figma.clientStorage.setAsync(fileKey + key, data)
}
/**
 * 获取选取图层的预览图
 * @param node
 */
export const getPreview = async (node: SceneNode): Promise<Preview> => {
  const previewWidth = 250 * 2
  const previewHeight = 116 * 2
  let ratio = 2
  if (node.width > previewWidth || node.height > previewHeight) {
    ratio = Math.min(previewWidth / node.width, previewHeight / node.height)
  }
  return {
    id: node.id,
    name: node.name.toLowerCase().replace(/ /gi, ''),
    width: node.width,
    height: node.height,
    buffer: await node.exportAsync({
      format: 'PNG',
      constraint: {
        type: 'SCALE',
        value: ratio,
      },
    }),
  }
}
export const SVGSetting: ExportSettings = {
  format: 'SVG',
}
/**
 * 获取导出设置
 * @param format
 * @param scale
 */
export const getExportSetting = (format: 'PNG' | 'JPG', scale = 1): ExportSettings => {
  return {
    format: format,
    constraint: {
      type: 'SCALE',
      value: scale,
    },
  }
}
/**
 *  休眠
 * @param ms
 */
const sleep = (ms: number) => {
  return new Promise((r) => setTimeout(r, ms))
}
/**
 * 导出图层
 * @param node
 * @param setting
 */
export const exportAsync = async (
  node: SceneNode,
  setting: ExportSettings,
): Promise<Uint8Array> => {
  await sleep(1)
  return node.exportAsync(setting)
}
