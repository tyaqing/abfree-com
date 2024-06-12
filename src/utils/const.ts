import { Format } from '@/types/interface'
import { isChannelWoa } from '@/utils/env.ts'

/**
 * 导出压缩比例
 */
export const SCALE_LIST = [0.5, 1, 2, 3, 4, 5]

/**
 * 导出格式
 */
export const FORMAT_LIST = [
  {
    name: 'PNG',
    value: Format.PNG,
  },
  {
    name: 'JPG',
    value: Format.JPG,
  },
  {
    name: 'SVG',
    value: Format.SVG,
  },
  {
    name: 'WEBP',
    value: Format.WEBP,
  },
  {
    name: 'AVIF',
    value: Format.AVIF,
  },
]

export const FORMAT_LIST_BROWSE = [
  {
    name: 'ORIGINAL',
    value: Format.ORIGINAL,
  },
  {
    name: 'WEBP',
    value: Format.WEBP,
  },
  {
    name: 'AVIF',
    value: Format.AVIF,
  },
]

/**
 * IOA用户保存的key
 */
export const IOA_USER_KEY = '_ioa_user'
/**
 * 上传历史数量
 */
export const HISTORY_NUM = 15
/**
 * 导出规则数量
 */
export const EXPORT_RULE_NUM = 5

export const FIGMA_CLIENT_MAX_WIDTH = 640
export const FIGMA_CLIENT_MIN_WIDTH = 300

/**
 * 语言
 */
export enum LANG {
  EN_US = 'en-US',
  ZH_CN = 'zh-CN',
  JA_JP = 'ja-JP',
}

export const LANG_LIST = [
  {
    key: LANG.EN_US,
    name: '🇺🇸 English',
    shortName: 'English',
  },
  {
    key: LANG.ZH_CN,
    name: '🇨🇳 简体中文',
    shortName: '简体中文',
  },
  {
    key: LANG.JA_JP,
    name: '🇯🇵 日本語',
    shortName: '日本語',
  },
]

const LINK_DEFAULT = {
  howToFix: 'https://www.abfree.com/guides/en/exportx-plugin',
  help: 'https://www.abfree.com/guides/en/exportx-plugin',
  uploadHelp: 'https://www.abfree.com/guides/en/exportx-plugin',
}

const LINK_WOA = {
  howToFix: 'https://iwiki.woa.com/p/4010391319',
  help: 'https://iwiki.woa.com/p/4010391319',
  uploadHelp: 'https://iwiki.woa.com/p/4010391319',
}

// 根据环境变量返回对应的api地址
export const LINK = isChannelWoa() ? LINK_WOA : LINK_DEFAULT
