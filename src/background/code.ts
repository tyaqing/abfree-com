import {
  type ExportDefault,
  type ExportOption,
  Format,
  PluginMessageType,
  type UiMessage,
  UiMessageType,
} from '@/types/interface'
import {exportAsync, getData, getExportSetting, getPreview, setData, SVGSetting} from './utils'

interface TmpExport {
  name: string
  node: SceneNode
}

/**
 *  显示UI
 */
figma.showUI(__html__, {themeColors: true, height: 660, width: 320})

figma.on('run', () => {
})

/**
 * 响应用户选择图层变化
 */
figma.on('selectionchange', () => {
  if (figma.currentPage.selection.length < 0) return
  // 压缩图片场景
  Promise.all(figma.currentPage.selection.map((node) => getPreview(node))).then((preview) => {
    figma.ui.postMessage({
      type: PluginMessageType.PREVIEW,
      data: preview,
    })
  })
})

figma.ui.onmessage = async (msg: UiMessage) => {
  const {type, data, messageId} = msg
  switch (type) {
    // 通过打开的登录UI PostMessage获取的用户信息
    case UiMessageType.SHOW_UI: {
      const {data} = msg
      await setData('_ioa_user', data)
      figma.showUI(__html__, {themeColors: true, height: 660, width: 320})
      break
    }
    /** 通知 */
    case UiMessageType.ERROR: {
      figma.notify(data, {
        error: true,
        timeout: 2000,
      })
      break
    }
    case UiMessageType.MESSAGE: {
      figma.notify(data, {
        timeout: 1000,
      })
      break
    }
    case UiMessageType.USER_GET: {
      figma.ui.postMessage({
        type: UiMessageType.USER_GET,
        data: {
          id: figma.currentUser?.id || '',
          name: figma.currentUser?.name || '',
        },
        messageId,
      })
      break
    }
    case UiMessageType.MODE_GET: {
      figma.ui.postMessage({
        type: UiMessageType.MODE_GET,
        data: figma.mode,
        messageId,
      })
      break
    }
    case UiMessageType.STORAGE_SET: {
      setData(data.key, data.value)
      break
    }
    case UiMessageType.STORAGE_GET: {
      getData(data).then((value) => {
        figma.ui.postMessage({
          type: UiMessageType.STORAGE_GET,
          data: value,
          messageId,
        })
      })
      break
    }
    // 获取上传源文件
    case UiMessageType.UPLOAD: {
      const {preview, scale, format}: ExportOption = data
      let exportSetting: ExportSettings = SVGSetting
      switch (format) {
        case Format.PNG: {
          exportSetting = getExportSetting('PNG', scale)
        }
          break
        case Format.JPG: {
          exportSetting = getExportSetting('JPG', scale)
        }
          break
      }

      const tmps: TmpExport[] = []
      preview.map((pre) => {
        const node = figma.currentPage.findOne((node) => node.id == pre.id)
        if (node != null) {
          const tmpNames = pre.name.split('/')
          tmpNames[tmpNames.length - 1] = tmpNames[tmpNames.length - 1]
          const tmpName = tmpNames.join('/')
          tmps.push({
            name: tmpName,
            node: node,
          })
        }
      })
      const exports: ExportDefault[] = []
      for (const tmp of tmps) {
        const exportData = {
          name: tmp.name,
          format: format,
          buffer: await exportAsync(tmp.node, exportSetting),
        }
        exports.push(exportData)
      }
      figma.ui.postMessage({
        type: PluginMessageType.UPLOAD,
        data: exports,
        messageId,
      })
    }
      break
  }
}
