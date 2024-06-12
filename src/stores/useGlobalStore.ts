import i18next from 'i18next'
import { nanoid } from 'nanoid'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { Format, PageType, type PreviewUi } from '@/types/interface'
import { LANG } from '@/utils/const'
import { isChannelWoa } from '@/utils/env.ts'

export interface IExportRule {
  id: string
  scale: number
  format: Format
  suffix: string
}

export enum MenuType {
  COMPRESS = 'compress',
  DEV = 'dev',
}

export enum UploadType {
  FREE = 'free',
  CUSTOM = 'custom',
}

export interface IoaUser {
  staffid: number
  staffname: string
}

export interface UploadConfig {
  // 是否启用上传
  enableUpload: boolean
  // 是否启用自定义上传
  useCustomUpload: UploadType
  imgHost: string
  customHeaders: string
  customBody: string
}

export interface IStore {
  menuType: MenuType
  setState: <T extends IStore>(payload: Partial<T>) => void
  pageType: PageType
  preview: PreviewUi[]
  /** 插件模式
   * default 编辑模式
   * inspect dev模式
   *  */
  mode: string
  loading: boolean
  exportRules: IExportRule[]
  destinationSheetVisible: boolean
  lang: string
  uploadConfig: UploadConfig
  // ioa登录用户
  ioaUser?: IoaUser
  changeLang(lang: string): void
  addExportRule(rule: IExportRule): void
  removeExportRule(id: string): void
  editExportRule(id: string, rule: Partial<IExportRule>): void
}

export const useGlobalStore = create<IStore>()(
  persist(
    (set) => ({
      menuType: MenuType.COMPRESS,
      setState: (payload) => {
        set(payload)
      },
      pageType: PageType.LOADING,
      preview: [],
      mode: '',
      loading: false,
      exportRules: [
        {
          id: nanoid(),
          scale: 2,
          format: Format.PNG,
          suffix: '',
        },
      ],
      ioaUser: undefined,
      lang: isChannelWoa() ? LANG.ZH_CN : LANG.EN_US,
      destinationSheetVisible: false,
      uploadConfig: {
        enableUpload: false,
        useCustomUpload: UploadType.FREE,
        imgHost: '',
        customHeaders: '',
        customBody: '',
      },
      changeLang(lang: string) {
        i18next.changeLanguage(lang)
        set({
          lang,
        })
      },
      addExportRule(rule) {
        set((state) => ({
          exportRules: [rule, ...state.exportRules],
        }))
      },
      removeExportRule(id) {
        set((state) => ({
          exportRules: state.exportRules.filter((item) => item.id !== id),
        }))
      },
      editExportRule(id, rule) {
        set((state) => ({
          exportRules: state.exportRules.map((item) => {
            if (item.id === id) {
              return {
                ...item,
                ...rule,
              }
            }
            return item
          }),
        }))
      },
    }),
    {
      name: 'figmaConfig',
      // storage: createJSONStorage(() => (isWeb() ? localStorage : CustomStorage)),
      partialize: (state) => ({
        exportRules: state.exportRules,
        lang: state.lang,
        uploadConfig: state.uploadConfig,
        ioaUser: state.ioaUser,
      }),
    },
  ),
)
