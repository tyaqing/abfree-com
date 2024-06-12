import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type {IExportRuleEntity} from '@/domain/exportRule.entity'
import { HISTORY_NUM } from '@/utils/const'
import * as localforage from 'localforage'

interface IProcessingStore {
  processingList: IExportRuleEntity[]
  addProcessing(processing: IExportRuleEntity): void
  editProcessing(processingId: string, processing: Partial<IExportRuleEntity>): void
  addTask(processingId: string, task: IExportRuleEntity): void
  editTask(processingId: string, taskId: string, task: Partial<IExportRuleEntity>): void
  clear(): void
}
export const useProcessingStore = create<IProcessingStore>()(
  persist(
    (set, get) => ({
      processingList: [],
      addProcessing: (processing) => {
        // 如果任务数量超过 10 个，删除最后一个
        if (get().processingList.length >= HISTORY_NUM) {
          // 清除掉对应的缓存
          const lastProcessing = get().processingList[HISTORY_NUM - 1]
          for (const task of lastProcessing.tasks) {
            localforage.removeItem(task.id)
          }
          set((state) => ({
            processingList: state.processingList.slice(0, HISTORY_NUM - 1),
          }))
        }
        set((state) => ({
          processingList: [processing, ...state.processingList],
        }))
      },
      editProcessing(processingId: string, processing: Partial<IExportRuleEntity>) {
        set((state) => ({
          processingList: state.processingList.map((item) => {
            if (item.id === processingId) {
              return {
                ...item,
                ...processing,
              }
            }
            return item
          }),
        }))
      },
      addTask: (processingId, task) => {
        set((state) => ({
          processingList: state.processingList.map((processing) => {
            if (processing.id === processingId) {
              return {
                ...processing,
                tasks: [...(processing.tasks || []), task],
              }
            }
            return processing
          }),
        }))
      },
      editTask(processingId: string, taskId: string, task: Partial<IExportRuleEntity>) {
        set((state) => ({
          processingList: state.processingList.map((processing) => {
            if (processing.id === processingId) {
              return {
                ...processing,
                tasks: processing.tasks?.map((item) => {
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
          }),
        }))
      },
      clear: () => {
        localforage.clear()
        set(() => ({
          processingList: [],
        }))
      },
    }),
    {
      name: 'processing-storage',
      partialize: (state) => {
        return {
          processingList: state.processingList,
        }
      },
    },
  ),
)
