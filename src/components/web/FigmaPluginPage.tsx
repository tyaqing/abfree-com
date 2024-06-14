import { useEffect, useRef } from 'react'
import { UploadPreview } from '@/components/UploadPreview.tsx'
import { useGlobalStore } from '@/stores/useGlobalStore.ts'
import {
  PageType,
  PluginMessageType,
  type Preview,
  type PreviewUi,
  UiMessageType,
} from '@/types/interface.ts'
import { toBase64 } from '@/utils/base64.ts'

import { vstack } from 'styled-system/patterns'
import CopywriterFooter from '@/components/CopywriterFooter.tsx'
import { ExportRules } from '@/components/ExportRules.tsx'
import UploadHistory from '@/components/UploadHistory.tsx'
import { Center } from 'styled-system/jsx'
import { report } from '@/utils/report.ts'
import UploadConfigSheet from '@/components/UploadConfigSheet.tsx'
import { ImageCompressor } from '@/imageCompressor/ImageCompressor.ts'
import { Header } from '@/components/Header.tsx'
// import { ThemeProvider } from '@/theme.tsx'
import { isChannelWoa } from '@/utils/env.ts'
import {type FigmaUser, useUserStore, xid } from '@/stores/useUserStore.ts'
import { sendToSandBox } from '@/utils/message.ts'
import { aegis } from '@/utils/aegis.ts'
import '@/utils/i18n.ts'
import '@preact/signals-react/auto'

export default function FigmaPluginPage() {
  const store = useGlobalStore()
  const scrollRef = useRef<HTMLDivElement>(null)
  const { figmaUser, checkWoaUser } = useUserStore()
  useEffect(() => {
    ImageCompressor.loadPngWasm()
    setTimeout(() => {
      store.setState({
        pageType: PageType.LOADED,
      })
    }, 200)
    init()
    window.addEventListener('message', onMessage)
    return () => {
      window.removeEventListener('message', onMessage)
    }
  }, [])

  const init = async () => {
    // 检查IOA用户
    isChannelWoa() && (await checkWoaUser())
    // 获取到Fimga用户信息
    const user = await sendToSandBox<FigmaUser>(UiMessageType.USER_GET)
    if (user) {
      figmaUser.value = user
    }
    aegis.setConfig({
      uin: xid.value,
    })
    // 获取模式
    const mode = await sendToSandBox<string>(UiMessageType.MODE_GET)
    store.setState({
      mode: mode || 'browser',
    })
    report('compressPageView')
  }

  const onMessage = (event: MessageEvent<any>) => {
    if (event.data.pluginMessage) {
      const { type, data } = event.data.pluginMessage
      if (type === PluginMessageType.PREVIEW) {
        const tmpPreview: PreviewUi[] = data.map((preview: Preview) => {
          return {
            ...preview,
            base64: toBase64(preview.buffer),
          }
        })
        store.setState({
          preview: tmpPreview,
        })
      }
    }
  }
  /** 如果有预览数据，滚动到顶部 */
  useEffect(() => {
    if (store.preview.length) {
      // 滚动到顶部 smooth
      scrollRef.current?.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }, [store.preview])
  if (store.pageType == PageType.LOADING) {
    return (
      <Center className={'w-full h-[100vh]'}>
        <svg
          className="h-5 w-5 animate-spin"
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.84998 7.49998C1.84998 4.66458 4.05979 1.84998 7.49998 1.84998C10.2783 1.84998 11.6515 3.9064 12.2367 5H10.5C10.2239 5 10 5.22386 10 5.5C10 5.77614 10.2239 6 10.5 6H13.5C13.7761 6 14 5.77614 14 5.5V2.5C14 2.22386 13.7761 2 13.5 2C13.2239 2 13 2.22386 13 2.5V4.31318C12.2955 3.07126 10.6659 0.849976 7.49998 0.849976C3.43716 0.849976 0.849976 4.18537 0.849976 7.49998C0.849976 10.8146 3.43716 14.15 7.49998 14.15C9.44382 14.15 11.0622 13.3808 12.2145 12.2084C12.8315 11.5806 13.3133 10.839 13.6418 10.0407C13.7469 9.78536 13.6251 9.49315 13.3698 9.38806C13.1144 9.28296 12.8222 9.40478 12.7171 9.66014C12.4363 10.3425 12.0251 10.9745 11.5013 11.5074C10.5295 12.4963 9.16504 13.15 7.49998 13.15C4.05979 13.15 1.84998 10.3354 1.84998 7.49998Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          ></path>
        </svg>
      </Center>
    )
  }
  const defaultTheme = isChannelWoa() ? 'blue' : 'light'
  return (
    <>
      <Header></Header>
      <div
        ref={scrollRef}
        className={vstack({
          position: 'relative',
          bg: 'gray.50',
          w: '100vw',
          h: '100vh',
          alignItems: 'stretch',
          divideY: '1px',
          overflow: 'scroll',
          gap: 2,
          pt: '44px',
          pb: 2,
        })}
      >

        <UploadPreview/>
        <ExportRules/>
        <UploadHistory/>
        <CopywriterFooter/>
        <UploadConfigSheet/>
      </div>
    </>

  )
}
