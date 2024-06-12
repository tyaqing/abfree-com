import { Format } from '@/types/interface.ts'
import { bytesToSize } from '@/utils/biz.ts'

export enum UploadStatus {
  INIT = 'INIT',
  UPLOADING = 'UPLOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

/**
 * 导出规则实体
 */
export interface IExportRuleEntity {
  base64?: string
  id: string
  key: string
  format: Format
  name: string
  size: number
  scale: number
  tasks: IExportRuleEntity[]
  originalSize: number
  suffix?: string
  // 上传路径
  url?: string
  // 上传结果
  uploadResult: UploadStatus
  // 阶段提示
  tip?: string
  // 错误信息
  errorMessage?: string
}

export class ExportRuleEntity implements IExportRuleEntity {
  base64?: string
  id: string
  key: string
  format: Format
  name: string
  size: number
  scale: number
  tasks: IExportRuleEntity[]
  originalSize: number
  suffix?: string
  uploadResult: UploadStatus.INIT
  tip?: string

  constructor(rule: IExportRuleEntity) {
    this.base64 = rule.base64
    this.id = rule.id
    this.key = rule.key
    this.format = rule.format
    this.name = rule.name
    this.size = rule.size
    this.scale = rule.scale
    this.tasks = rule.tasks
    this.originalSize = rule.originalSize
    this.suffix = rule.suffix
    this.uploadResult = UploadStatus.INIT
    this.tip = rule.tip
  }

  /**
   * 获取文件名
   */
  public getFilename() {
    let filename = this.name || this.key
    if (this.suffix) {
      filename = filename + this.suffix
    }
    return filename + '.' + this.format
  }
  /**
   * 获取文件名多个
   */
  public getFilesName() {
    return this.tasks.map((item) => {
      const _taskEntity = new ExportRuleEntity(item)
      return _taskEntity.getFilename()
    })
  }
  /**
   * 获取原始文件大小
   */
  public getOriginalSize() {
    return bytesToSize(this.originalSize)
  }

  /**
   * 获取压缩后文件大小
   */
  public getSize() {
    return bytesToSize(this.size)
  }
  // 获取压缩比
  public getCompressRate() {
    // 返回格式如果体积增加为: +12% 减少为 -12%
    const rate = ((this.size - this.originalSize) / this.originalSize) * 100
    return rate.toFixed(2) + '%'
  }
}
