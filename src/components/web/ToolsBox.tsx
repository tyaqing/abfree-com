import { CirclePlus, ImagePlus, MessageSquareQuote } from 'lucide-react'
import { ExportRuleEntity, type IExportRuleEntity, UploadStatus } from '@/domain/exportRule.entity.ts'
import UploadCard from '@/components/UploadCard.tsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx'
import { Format } from '@/types/interface.ts'
import { FORMAT_LIST_BROWSE } from '@/utils/const.ts'
import { Button } from '@/components/ui/button.tsx'
import { useDropzone } from 'react-dropzone'
import { useLocalStorage } from 'react-use'
import { useProcessing } from '@/stores/useProcessing.ts'
import { useEffect } from 'react'
import { nanoid } from 'nanoid'
import { ImageCompressor } from '@/imageCompressor/ImageCompressor.ts'
import localforage from 'localforage'
import { aegis } from '@/utils/aegis.ts'
import '@preact/signals-react/auto'
import '@/styles/index.css'

export default function () {
  const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/svg+xml': ['.svg'],
    },
  })

  const [format, setFormat] = useLocalStorage('format', Format.ORIGINAL)

  const { addProcessing, addTask, processingList, editProcessing, editTask, clearProcessing } =
    useProcessing()

  useEffect(() => {
    append()
  }, [acceptedFiles])

  const append = async () => {
    for (const file of acceptedFiles) {
      const processId = nanoid()
      const taskId = nanoid()

      const imageCompressor = new ImageCompressor(file)
      const fileFormat = imageCompressor.getImageType()
      // 创建base64预览
      const base64 = await imageCompressor.toBase64()

      let toFormat = fileFormat

      // SVG不支持转换格式
      if (fileFormat !== Format.SVG && format !== Format.ORIGINAL) {
        toFormat = format!
      }

      const filenameWithoutExt = file.name.replace(/\.[^/.]+$/, '')

      const process = new ExportRuleEntity({
        format: toFormat,
        id: processId,
        key: '',
        name: filenameWithoutExt,
        originalSize: file.size,
        scale: 1,
        tasks: [],
        size: file.size,
        uploadResult: UploadStatus.UPLOADING,
        base64: base64,
        tip: 'Processing...',
      })
      addProcessing(process)

      let blob: Blob | null = null
      try {
        blob = await imageCompressor.compressTo(toFormat)
        await localforage.setItem(taskId, blob)
      } catch (err: any) {
        console.warn(err)
        aegis.error(err)
        await localforage.setItem(taskId, file)
        editProcessing(processId, {
          tip: '',
          errorMessage: 'Compress Error :' + err.message,
        })
        editTask(processId, taskId, {
          key: taskId,
          size: file.size,
          uploadResult: UploadStatus.ERROR,
        })
        return
      }
      editProcessing(processId, {
        tip: '',
      })

      const task = new ExportRuleEntity({
        format: fileFormat,
        id: taskId,
        key: taskId,
        name: filenameWithoutExt,
        originalSize: file.size,
        scale: 1,
        tasks: [],
        size: blob.size,
        uploadResult: UploadStatus.INIT,
        base64: base64,
      })
      addTask(processId, task)
    }
  }
  const onRuleFormatChange = (value: Format) => {
    setFormat(value)
  }

  return (
    <div className={'relative'}>
      {/*<img*/}
      {/*  className={'absolute bottom-[30px] -left-[220px]'}*/}
      {/*  src="https://cdn.abfree.com/public/s8ZsEELeH8ZrN4TB.svg"*/}
      {/*  alt=""*/}
      {/*/>*/}
      <div className={'w-[380px] mt-20 rounded-lg shadow-custom h-min  overflow-hidden'}>
        {/*顶部*/}
        <div className={'px-3 py-3 bg-black border-b text-white'}>
          <div className={'text-sm inline-flex items-center gap-3 text-red-500'}>
            <MessageSquareQuote />{' '}
            <span>
              <b>No File Size Limits</b>, Support PNG, JPG, SVG
            </span>
          </div>
        </div>

        {/*历史记录*/}
        <div

          className={'items-stretch w-full gap-2 h-[280px] flex flex-col overflow-auto pt-3 pb-3 px-3'}
        >
          {processingList.value.map((file: IExportRuleEntity) => (
            <UploadCard data={file} key={file.id} />
          ))}
          {/*拖动区域*/}
          {!processingList.value.length && (
            <div
              {...getRootProps({ className: 'dropzone' })}
              className={
                'flex items-center justify-center h-full border border-dashed border-2 rounded-lg hover:border-gray-500 transition-all'
              }
            >
              <input {...getInputProps()} />
              <div  className={'flex flex-col'}>
                <ImagePlus className={'text-3xl'} />
                <div className={'text-sm'}>
                  Drag & Drop or{' '}
                  <a onClick={open} className={'text-blue-500 cursor-pointer'}>
                    Browse
                  </a>{' '}
                  to upload
                </div>
              </div>
            </div>
          )}
        </div>
        {/* 底部操作 */}
        <div className={'px-3 py-3 bg-gray-200 border-t flex'}>
          <Select
            defaultValue={format}
            onValueChange={(value: any) => onRuleFormatChange(value as Format)}
          >
            <SelectTrigger className={'w-[100px] h-8 text-xs bg-white'}>
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent className={'w-[50px]'}>
              {FORMAT_LIST_BROWSE.map((item, index) => (
                <SelectItem key={index} value={item.value}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={clearProcessing} variant={'link'} size={'sm'} className={'gap-1'}>
            Clear All
          </Button>
          <div className={'flex-1'}></div>
          <Button type="button" size={'default'} onClick={open} className={'gap-1'}>
            <CirclePlus /> Add File
          </Button>
        </div>
      </div>
    </div>
  )
}
