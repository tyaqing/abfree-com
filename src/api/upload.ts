import { figmaUser, woaUser, xid } from '@/stores/useUserStore.ts'
import { isChannelWoa } from '@/utils/env.ts'

export interface UploadConfig {
  file: File
  url: string
  body?: Record<string, string>
  headers?: Record<string, string>
  format: string
}

// 上传文件
export async function uploadFile(config: UploadConfig): Promise<{
  url: string
}> {
  const fd = new FormData()
  fd.append('file', config.file)
  fd.append('fileName', config.file.name)
  fd.append('format', config.format)

  // 增加ioa登录信息
  if (woaUser.value.staffid) {
    fd.append('staffId', woaUser.value.staffid)
    fd.append('staffName', woaUser.value.staffname)
  }
  // 获取figma用户信息
  if (figmaUser.value.id) {
    fd.append('figmaName', figmaUser.value.name)
    fd.append('figmaId', figmaUser.value.id)
  }
  // 生成一个xid staffId@figmaId
  if (xid.value) {
    fd.append('xid', xid.value)
  }

  if (config.body) {
    for (const key in config.body) {
      fd.append(key, config.body[key])
    }
  }

  const res = await fetch(config.url, {
    method: 'POST',
    body: fd,
    headers: config.headers,
    credentials: isChannelWoa() ? 'include' : 'same-origin',
  })

  if (res.status < 200 || res.status >= 300) {
    throw new Error(String(res.status))
  }

  const data = await res.json()
  return data
}
