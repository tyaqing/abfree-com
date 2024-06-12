import { computed, signal } from '@preact/signals-react'
import { IOA_USER_KEY } from '@/utils/const.ts'

export interface FigmaUser {
  id: string
  name: string
}
export interface WoaUser {
  staffid: string
  staffname: string
}

// figma用户信息 每次启动时，由figma code插件发送
export const figmaUser = signal<FigmaUser>({
  id: '',
  name: '',
})
// woa用户信息，由ioa登录时存入localStorage
export const woaUser = signal<WoaUser>({
  staffid: '',
  staffname: '',
})

export const xid = computed(() => {
  if (!woaUser.value.staffname) {
    return `${figmaUser.value.name}@${figmaUser.value.id}`
  }
  return `${woaUser.value.staffname}@${figmaUser.value.id}`
})

/**
 * 用户信息
 */
export function useUserStore() {
  const init = async () => {
    const item = localStorage.getItem(IOA_USER_KEY)
    if (!item) return
    try {
      woaUser.value = JSON.parse(item || '')
    } catch (e) {
      console.error('init error', e)
    }
  }
  // 生成一个xid staffId@figmaId

  // useEffect(() => {
  //   init()
  // }, [])

  // 判断用户信息
  const checkWoaUser = async () => {
    await init()
    console.log('woaUser', woaUser.value)
    if (!woaUser.value.staffname) {
      // 未登录
      location.href = import.meta.env.PUBLIC_CF_WORKER + '/ioa'
    }
  }

  return {
    figmaUser,
    woaUser,
    init,
    checkWoaUser,
    xid,
  }
}
