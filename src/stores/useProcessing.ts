import { signal } from '@preact/signals-react'
import type {IExportRuleEntity} from '@/domain/exportRule.entity.ts'
import { HISTORY_NUM } from '@/utils/const.ts'
import localforage from 'localforage'
import { useEffect } from 'react'
const storageKey = 'processingList'

const processingList = signal<IExportRuleEntity[]>([])

export function useProcessing() {
  useEffect(() => {
    const init = async () => {
      // 从缓存中读取处理中的任务
      const data = await localforage.getItem(storageKey)
      if (data) {
        processingList.value = data as IExportRuleEntity[]
      }
    }
    init()
  }, [])

  useEffect(() => {
    if (processingList.value.length === 0) return
    // 监听处理中的任务变化，将任务存入缓存
    localforage.setItem(storageKey, processingList.value)
  }, [processingList.value])
  /**
   * 添加一个处理中的任务
   * @param processing
   */
  const addProcessing = (processing: IExportRuleEntity) => {
    // 如果任务数量超过 10 个，删除最后一个
    if (processingList.value.length >= HISTORY_NUM) {
      // 清除掉对应的缓存
      const lastProcessing = processingList.value[HISTORY_NUM - 1]
      for (const task of lastProcessing.tasks) {
        localforage.removeItem(task.id)
      }
      processingList.value = processingList.value.slice(0, HISTORY_NUM - 1)
    }
    processingList.value = [processing, ...processingList.value]
  }
  // 编辑处理中的任务
  const editProcessing = (processingId: string, processing: Partial<IExportRuleEntity>) => {
    processingList.value = processingList.value.map((item) => {
      if (item.id === processingId) {
        return {
          ...item,
          ...processing,
        }
      }
      return item
    })
  }
  // 添加一个子任务
  const addTask = (processingId: string, task: IExportRuleEntity) => {
    processingList.value = processingList.value.map((processing) => {
      if (processing.id === processingId) {
        return {
          ...processing,
          tasks: [...(processing.tasks || []), task],
        }
      }
      return processing
    })
  }
  // 编辑子任务
  const editTask = (processingId: string, taskId: string, task: Partial<IExportRuleEntity>) => {
    processingList.value = processingList.value.map((processing) => {
      if (processing.id === processingId) {
        return {
          ...processing,
          tasks: processing.tasks.map((item) => {
            if (item.id === taskId) {
              return {
                ...item,
                ...task,
              }
            }
            return item
          }),
        }
      }
      return processing
    })
  }
  // 清空处理中的任务
  const clearProcessing = () => {
    localforage.clear()
    processingList.value = []
  }

  return {
    processingList,
    addProcessing,
    editProcessing,
    addTask,
    editTask,
    clearProcessing,
  }
}
