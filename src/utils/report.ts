'use client'
import { nanoid } from 'nanoid'

const url =
  'https://ap-hongkong.cls.tencentcs.com/track?topic_id=c4ac9801-3ea9-4c60-a585-bfa64fa17a75'

import packageInfo from '../../package.json'
import { useGlobalStore } from '@/stores/useGlobalStore'
import { xid } from '@/stores/useUserStore.ts'

interface ReportParams {
  method?: string
  // 保留参数
  msg1?: string
  msg2?: string
  msg3?: string
  msg4?: string
  msg5?: string
  msg6?: string
  // 指标
  metric1?: number
  metric2?: number
  metric3?: number
  metric4?: number
  metric5?: number
  metric6?: number
}

let userId = ''

export function report(event: string, params?: ReportParams) {
  // 首先看是否有xid，如果有则使用xid，否则使用随机生成的userId
  userId = xid.value || userId
  // 将参数对象转换为查询字符串
  const rptParams = {
    event,
    userId,
    // 插件模式
    mode: useGlobalStore.getState().mode,
    // 浏览器语言
    language: navigator.language,
    // i18n
    locale: useGlobalStore.getState().lang,
    pageUrl: window.location.href,
    path: window.location.pathname,
    clientTime: new Date().toISOString(),
    version: packageInfo.version,
    referrer: document.referrer,
    env: process.env.NODE_ENV,
    project: import.meta.env.VITE_PROJECT_NAME || packageInfo.name,
    ...params,
  }

  // 创建新的Image对象
  const img = new Image()
  // 设置src属性以触发GET请求
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  img.src = `${url}&${new URLSearchParams(rptParams)}`
}

initUserId()

/**
 * 初始化userId
 */
function initUserId() {
  if (typeof window === 'undefined') {
    return
  }
  // 从localStorage中获取userId
  const userIdFromLs = window.localStorage.getItem('userId')
  // 如果不存在则生成一个新的userId
  if (!userIdFromLs) {
    userId = nanoid()
    localStorage.setItem('userId', userId)
  } else {
    userId = userIdFromLs
  }
}
