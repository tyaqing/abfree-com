import type {IExportRuleEntity} from '@/domain/exportRule.entity.ts'
import React from 'react'
import {useCopyToClipboard} from 'react-use'
import {report} from '@/utils/report.ts'
import {toast} from '@/utils/message.ts'
import {Tag} from '@/components/custom/Tag.tsx'
import {bytesToSize} from '@/utils/biz.ts'
import {ReloadIcon} from '@radix-ui/react-icons'
import {tagColor} from '@/utils/style.ts'
import {Button} from '@/components/ui/button.tsx'
import {Copy, Download} from 'lucide-react'
import {downloadSingle} from '@/utils/zip.ts'
import classNames from "classnames";

export interface IUploadDetailCardProps {
  data: IExportRuleEntity
  showDownload?: boolean
  task?: IExportRuleEntity[]
  showDetail?: boolean
}

export const ImageCard = React.memo(function UploadDetailCard(props: IUploadDetailCardProps) {
  const plusOrMinus = 100 - Math.floor((props.data.size / props.data.originalSize) * 100)
  const [, copyToClipboard] = useCopyToClipboard()
  const onCopy = (key: string) => {
    report('copyUrl')
    copyToClipboard(key)
    toast('Copied to clipboard')
  }
  return (
    <div  className={'flex gap-2 items-center'}>
      {/*倍率*/}
      <div className={'flex-1'}>
        <Tag
          className={'bg-zinc-600 text-2xs max-w-min'}
        >
          {props.data.scale}x
        </Tag>
      </div>

      {/*压缩进度*/}
      {props.data.key ? (
        <div  className={'text-xs flex flex-1'}>
          {bytesToSize(props.data.size)}
        </div>
      ) : (
        <ReloadIcon/>
      )}
      {/*原始大小*/}
      <div  className={'line-through text-xs flex flex-1 text-gray-400'} color={'gray.400'}>
        {bytesToSize(props.data.originalSize)}
      </div>
      {/* 压缩率 */}
      {props.data.size && (
        <Tag
          className={classNames({
            bg: plusOrMinus >= 0 ? 'cyan.200' : 'red.200',
            color: plusOrMinus >= 0 ? 'cyan.900!' : 'red.900',
          })}
        >
          {plusOrMinus >= 0 ? '-' : '+'}
          {Math.abs(100 - Math.floor((props.data.size / props.data.originalSize) * 100))}%
        </Tag>
      )}
      {/* 格式 */}
      <div  className={'flex flex-[1.5]'}>
        <Tag
          className={classNames('uppercase',{
            bg: tagColor(props.data.format),
            maxW: 'min-content',
          })}
          style={{
            backgroundColor: `var(--colors-${tagColor(props.data.format)}-200)`,
            color: `var(--colors-${tagColor(props.data.format)}-900)`,
          }}
        >
          {props.data.format}
        </Tag>
      </div>

      <div className={'flex-1'}></div>

      {props.data.url ? (
        <Button
          aria-label="download"
          size={'xs'}
          onClick={() => {
            onCopy(props.data.url || '')
          }}
          className={'text-xs'}
          variant={'outline'}
        >
          <Copy/>
        </Button>
      ) : (
        <Button
          onClick={() => downloadSingle(props.data)}
          disabled={!props.data.key}
          aria-label="Search database"
          className={'text-xs'}
          size={'xs'}
          variant={'outline'}
        >
          <Download/>
        </Button>
      )}
    </div>
  )
})
