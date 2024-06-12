import { report } from '@/utils/report.ts'
import JSZip from 'jszip'
import { ExportRuleEntity, type IExportRuleEntity } from '@/domain/exportRule.entity.ts'
import localforage from 'localforage'

/**
 * 压缩下载多个文件
 * @param tasks
 */
export const getDownloadAllUrl = async (tasks: IExportRuleEntity[]) => {
  report('compressDownload')
  const zip = new JSZip()
  const map = new Map()
  for (const task of tasks) {
    const fileName = new ExportRuleEntity(task).getFilename()
    const { format } = task

    const blob: Blob | null = await localforage.getItem(task.id)
    if (!blob) throw new Error(' blob is null')
    // 如果存在相同的key，需要在key后面加上序号 name-1.jpg,name-2.jpg
    if (map.has(fileName)) {
      zip.file(`${task.name}-${map.get(fileName)}.${format}`, blob)
      map.set(fileName, map.get(fileName) + 1)
    } else {
      zip.file(fileName, blob)
      map.set(fileName, 1)
    }
  }
  // 生成zip文件
  const content = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(content)
  const a = document.createElement('a')
  a.href = url
  a.download = 'achieve.zip'
  a.click()
}

export const downloadSingle = async (singleTask: IExportRuleEntity) => {
  report('compressDownload')
  const blob: Blob | null = await localforage.getItem(singleTask.id)
  if (!blob) throw new Error(' blob is null')
  // 本地下载
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = singleTask.name + '.' + singleTask.format
  a.click()
}
