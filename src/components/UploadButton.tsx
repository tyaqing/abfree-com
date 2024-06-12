import { Base64 } from 'js-base64'
import { nanoid } from 'nanoid'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { uploadFile } from '@/api/upload'
import { Button } from '@/components/ui/button'
import { ImageCompressor } from '@/imageCompressor/ImageCompressor'
import { UploadType, useGlobalStore } from '@/stores/useGlobalStore'
import { useProcessingStore } from '@/stores/useProcessingStore'
import { Format } from '@/types/interface'
import { toBase64 } from '@/utils/base64'
import { uploadPreCheck } from '@/utils/biz'
import { getExportFile } from '@/utils/message'
import { UploadStatus } from '@/domain/exportRule.entity'
import * as localforage from 'localforage'
import { css } from '../../styled-system/css'
import { report } from '@/utils/report'
import { hstack } from '../../styled-system/patterns'
import { isChannelWoa } from '@/utils/env.ts'
import { ImageUp, Zap } from 'lucide-react'
import { aegis } from '@/utils/aegis.ts'

export default function UploadButton() {
  const store = useGlobalStore()
  const processingStore = useProcessingStore()
  const previewNames = useMemo(() => {
    return store.preview.map((pre) => pre.name)
  }, [store.preview])
  const { t } = useTranslation()
  // 如果文件名包含其他字符则使用base64编码
  const filenameHasOtherChar = useMemo(() => {
    if (!store.preview.length) return ''
    return !store.preview[0].name.match(/^[a-zA-Z0-9_-]+$/)
  }, [store.preview])

  // 文件名
  const fileName = useMemo(() => {
    if (!store.preview.length) return ''
    // if filename include other than /a-zA-Z0-9_-/ will use base64(filename)
    if (filenameHasOtherChar) {
      return Base64.encode(store.preview[0].name)
    } else {
      return store.preview[0].name
    }
  }, [store.preview, filenameHasOtherChar])

  const compressHandler = async () => {
    // 如果没有预览文件则不进行压缩
    if (!uploadPreCheck(store.preview, previewNames)) {
      report('compressUnselected')
      return
    }
    const processId = nanoid()
    const firstRule = store.exportRules[0]

    // 显示区域为 48px * 48px 2倍图显示为 96px * 96px 如果图片宽高大于这个值则压缩到这个值
    const baseWidth = 48 * 4
    const { width, height } = store.preview[0]
    let minBase64 = store.preview[0].base64
    if (width > baseWidth || height > baseWidth) {
      // scale 为 0 - 1 之间的值
      const scale = Math.min(baseWidth / width, baseWidth / height)
      const minPreview = await getExportFile(store.preview, Format.PNG, scale)
      minBase64 = toBase64(minPreview)
    }
    // 增加一个处理中的任务
    processingStore.addProcessing({
      base64: minBase64,
      id: processId,
      key: '',
      name: fileName,
      size: 0,
      format: firstRule.format,
      scale: 0,
      tasks: [],
      originalSize: 0,
      uploadResult: UploadStatus.UPLOADING,
      tip: 'Processing...',
    })

    for (const [index, rule] of store.exportRules.entries()) {
      // 如果是webp,avif 使用png作为原图
      const format =
        rule.format === Format.WEBP || rule.format === Format.AVIF ? Format.PNG : rule.format

      const taskId = nanoid()
      // 增加一个子任务
      processingStore.addTask(processId, {
        id: taskId,
        key: '',
        format: rule.format,
        scale: rule.scale,
        size: 0,
        name: fileName,
        tasks: [],
        originalSize: 0,
        suffix: rule.suffix,
        uploadResult: UploadStatus.UPLOADING,
        tip: '',
      })

      processingStore.editProcessing(processId, {
        tip: `${index + 1}/${store.exportRules.length} Extract Image`,
      })
      const fileBuf = await getExportFile(store.preview, format, rule.scale)

      processingStore.editTask(processId, taskId, {
        originalSize: fileBuf.length,
      })

      const file = new File([fileBuf], fileName, {
        type: `image/${format}`,
      })

      // 判断是否已经加载对应压缩模块
      if (!(await ImageCompressor.isLoadWasm(rule.format))) {
        processingStore.editProcessing(processId, {
          tip: `${index + 1}/${store.exportRules.length} Load ${rule.format} Wasm`,
        })
        // 加载对应wasm模块
        await ImageCompressor.loadWasm(rule.format)
      }

      processingStore.editProcessing(processId, {
        tip: `${index + 1}/${store.exportRules.length} Compressing ${rule.format}`,
      })
      const t1 = performance.now()

      // compressImage(file, rule.format)
      let blob: Blob | null = null
      try {
        blob = await ImageCompressor.compress(file, rule.format)
      } catch (err: any) {
        aegis.error(err)
        await localforage.setItem(taskId, file)
        processingStore.editProcessing(processId, {
          tip: '',
          errorMessage: 'Compress Error :' + err.message,
        })
        processingStore.editTask(processId, taskId, {
          key: taskId,
          size: file.size,
          uploadResult: UploadStatus.ERROR,
        })
        return
      }

      // 如果没有任务了tip显示为空，如果有任务 就显示剩余任务
      if (index === store.exportRules.length - 1 && !store.uploadConfig.enableUpload) {
        processingStore.editProcessing(processId, {
          tip: '',
        })
      }

      const t2 = performance.now()

      processingStore.editTask(processId, taskId, {
        size: blob.size,
        key: taskId,
      })
      // 存入到indexedDB
      await localforage.setItem(taskId, blob)
      // 上传的url
      let url = ''
      // 如果开启上传则上传
      if (store.uploadConfig.enableUpload) {
        const isCustom = store.uploadConfig.useCustomUpload === UploadType.CUSTOM
        const dlFile = new File([blob], `${fileName}.${rule.format}`, {
          type: `image/${rule.format}`,
        })

        // 获取上传的url
        const ulUrl = isCustom
          ? store.uploadConfig.imgHost
          : `${import.meta.env.VITE_CF_WORKER}/upload`

        // 上传文件
        try {
          processingStore.editProcessing(processId, {
            tip: `${index + 1}/${store.exportRules.length} Uploading ${rule.format}`,
          })
          const uploadT0 = performance.now()
          const uploadRes = await uploadFile({
            file: dlFile,
            url: ulUrl,
            body: isCustom ? JSON.parse(store.uploadConfig.customBody || '{}') : {},
            headers: isCustom ? JSON.parse(store.uploadConfig.customHeaders || '{}') : {},
            format: rule.format,
          })
          const uploadT1 = performance.now()
          // 如果上传完成则更新tip
          if (index === store.exportRules.length - 1) {
            processingStore.editProcessing(processId, {
              tip: '',
            })
          }

          // 如果是http替换成https
          if (isCustom) {
            url = uploadRes.url
          } else {
            url = uploadRes.url
          }
          report('uploadSuccess', {
            // 格式
            msg1: rule.format,
            // url
            msg2: url,
            // 自定义上传
            msg3: store.uploadConfig.useCustomUpload,
            // 文件大小
            metric1: blob.size,
            // 倍率
            metric2: rule.scale,
            // 请求耗时
            metric3: Math.round(uploadT1 - uploadT0),
          })
          processingStore.editTask(processId, taskId, {
            key: taskId,
            size: blob.size,
            url,
            uploadResult: UploadStatus.SUCCESS,
          })
        } catch (e: Error | any) {
          aegis.error(e)
          processingStore.editProcessing(processId, {
            tip: '',
            errorMessage: 'Upload Error :' + e.message,
          })
          processingStore.editTask(processId, taskId, {
            key: taskId,
            size: blob.size,
            uploadResult: UploadStatus.ERROR,
          })
        }
      }
      report('compressSuccess', {
        // 格式
        msg1: rule.format,
        // 倍率
        metric3: rule.scale,
        // 压缩后文件大小
        metric1: blob.size,
        // 原始文件大小
        metric2: file.size,
        // 压缩耗时
        metric4: Math.round(t2 - t1),
      })
    }
  }
  let buttonName = ''
  let RightIcon
  if (isChannelWoa()) {
    buttonName = t('压缩')
    RightIcon = (
      <div className={'ml-2 text-sm'}>
        <Zap />
      </div>
    )
  } else {
    buttonName = store.uploadConfig.enableUpload ? 'Get Image Link' : t('压缩')
    RightIcon = store.uploadConfig.enableUpload ? (
      <div
        className={hstack({
          // bg: '#FFDA5E',

          justifyContent: 'center',
          rounded: 'full',
          fontSize: 'md',
          ml: 2,
        })}
      >
        <ImageUp></ImageUp>
      </div>
    ) : (
      <div className={'ml-2 text-md'}>
        <Zap />
      </div>
    )
  }

  return (
    <Button disabled={store.loading} size={'sm'} onClick={compressHandler} className={'relative'}>
      <div
        className={css({
          fontWeight: 'bold',
          fontSize: 'sm',
        })}
      >
        {buttonName}
      </div>
      {RightIcon}
    </Button>
  )
}
