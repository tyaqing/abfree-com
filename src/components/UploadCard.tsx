import {useRef, useState} from 'react'
import {Button} from '@/components/ui/button'
import {ExportRuleEntity, type IExportRuleEntity} from '@/domain/exportRule.entity'
import {bytesToSize} from '@/utils/biz'
import {toast} from '@/utils/message'

import {Tag} from './custom/Tag'
import {report} from '@/utils/report'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip.tsx'
import {LINK} from '@/utils/const.ts'
import {tagColor} from '@/utils/style.ts'
import {downloadSingle, getDownloadAllUrl} from '@/utils/zip.ts'
import {ChevronDown, ChevronRight, Copy, Download, ExternalLink} from 'lucide-react'
import {useCopyToClipboard} from 'react-use'
import {ImageCard} from '@/components/ImageCard.tsx'
import classNames from "classnames";

// import { toast } from '@/utils/message.ts'

export interface IUploadCardProps {
  data: IExportRuleEntity
}

export default function UploadCard(props: IUploadCardProps) {
  const ruleEntity = new ExportRuleEntity(props.data)
  const [, copyToClipboard] = useCopyToClipboard()
  const cardRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const isSingle = props.data.tasks.length == 1
  const singleTask = props.data.tasks[0]
  const totalSize = props.data?.tasks.reduce((acc, cur) => acc + cur.size, 0) || 0
  const totalOriginalSize = props.data.tasks?.reduce((acc, cur) => acc + cur.originalSize, 0) || 0
  const plusOrMinus = 100 - Math.floor((totalSize / totalOriginalSize) * 100)

  // 这里兼容一下老逻辑 之前的base64是不带前缀的，现在的base64是带前缀的
  const base64 = props.data.base64?.startsWith('data:')
    ? props.data.base64
    : `data:image/png;base64,${props.data.base64}`

  const onCopy = (key: string) => {
    report('copyUrl')
    copyToClipboard(key)
    toast('Copied to clipboard')
  }
  const allUploaded = props.data.tasks.length && props.data.tasks.every((item) => item.key)
  return (
    <div

      ref={cardRef}
      className={'flex flex-col items-stretch bg-white p-2 border border-gray-200 rounded-sm divide-y-1'}
    >
      {/* 卡片头部 */}
      <div  className={'flex gap-2 items-stretch'}>
        {/*缩略图*/}
        <div
          className={'border flex items-center justify-center rounded-sm w-[50px] h-[50px] overflow-hidden'}
        >
          <img
            className="p-1 object-cover
            hover:scale-[1.1] transition-transform duration-300
             w-[50px] h-[50px] transparent-square-background"
            aria-labelledby={'image'}
            src={base64}
            alt={''}
          />
        </div>
        <div className={'flex relative flex-1'} >
          <div
            className={'flex flex-col absolute left-0 top-0 right-0 bottom-0 justify-center items-stretch'}
          >
            {/*文件名*/}
            <div  className={'flex gap-1'}>
              {props.data?.errorMessage && (
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger>
                      <div
                        className={'flex text-red-500 text-xs bg-red-100 gap-0.5 px-1.5 py-0 cursor-help rounded-md'}
                      >
                        {/*红点*/}
                        <div className={'w-2 h-2 rounded-full bg-red-500'}></div>
                        <div className={'font-bold'}>Err</div>
                        {/*<CircleAlert size={'16px'} className={'text-yellow-500 text-sm'} />*/}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent alignOffset={50} side={'bottom'} align={'center'}>
                      <p className={'w-[210px] leading-5'}>
                        <span className={'text-yellow-500 font-bold'}>
                          {props.data.errorMessage}
                        </span>
                        <br/>
                        but you can download it locally <br/>
                        <a
                          className={'flex underline items-center gap-1'}
                          target={'_blank'}
                          href={LINK.howToFix}
                        >
                          how to fix it? <ExternalLink/>
                        </a>
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              <div className={'direction-reverse max-w-full truncate text-xs'}>
                {props.data.name}
              </div>
            </div>

            {!props.data?.tip ? (
              <div className={'flex font-mono items-center gap-2 md:gap-3 text-xs'}>
                {/*压缩后大小*/}
                <div className={'font-bold'}>{bytesToSize(totalSize)}</div>
                {/*原始大小*/}
                <div className={'line-through text-xs text-gray-400'}>
                  {bytesToSize(totalOriginalSize)}
                </div>
                {/*压缩率*/}
                <Tag
                  className={classNames({
                    bg: plusOrMinus >= 0 ? 'cyan.200' : 'red.200',
                    color: plusOrMinus >= 0 ? 'cyan.900!' : 'red.900',
                  })}
                >
                  {plusOrMinus >= 0 ? '-' : '+'}
                  {Math.abs(100 - Math.floor((totalSize / totalOriginalSize) * 100))}%
                </Tag>
                {/*格式*/}
                {isSingle ? (
                  <Tag
                    className={'uppercase'}
                    style={{
                      backgroundColor: `var(--colors-${tagColor(props.data.format)}-200)`,
                      color: `var(--colors-${tagColor(props.data.format)}-900)`,
                    }}
                  >
                    {props.data.format}
                  </Tag>
                ) : (
                  // 展示更多按钮
                  <Button
                    onClick={() => setIsOpen(!isOpen)}
                    variant={isOpen ? 'default' : 'secondary'}
                    className={'h-[18px] rounded-full cursor-pointer'}
                    aria-label={'more'}
                    size={'xs'}
                  >
                    {isOpen ? <ChevronDown/> : <ChevronRight/>}
                  </Button>
                )}
              </div>
            ) : (
              // tip信息
              <div className={'flex text-xs items-center gap-2 leading-[16px]'}>
                <span className="relative flex h-3 w-3">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                </span>

                <div className={'text-gray-500 truncate'}>{props.data.tip}</div>
              </div>
            )}
          </div>
        </div>

        <div className={'flex items-center justify-center'}>
          {isSingle && singleTask.url ? (
            //  复制按钮
            <Button
              disabled={!allUploaded}
              aria-label="download"
              variant={'ghost'}
              size={'sm'}
              className={'text-sm p-2'}
              onClick={() => {
                onCopy(singleTask.url || '')
              }}
            >
              <Copy/>
            </Button>
          ) : props.data.tasks.length > 1 ? (
            // 批量下载按钮
            <Button
              onClick={() => getDownloadAllUrl(ruleEntity.tasks)}
              disabled={!allUploaded}
              aria-label="download"
              variant={'ghost'}
              className={'text-sm p-2'}
              size={'sm'}
            >
              <Download/>
            </Button>
          ) : (
            // 单个下载按钮
            <Button
              onClick={() => downloadSingle(singleTask)}
              disabled={!allUploaded}
              aria-label="download"
              variant={'ghost'}
              className={'p-2 text-sm'}
              size={'sm'}
            >
              <Download/>
            </Button>
          )}
        </div>
      </div>
      {/*卡片详情*/}
      {props.data.tasks.length > 1 && isOpen && (
        <div
          className={'transition-all duration-300 ease-in-out flex flex-col gap-1 items-stretch pt-2'}
        >
          {props.data.tasks.map((item) => (
            <ImageCard data={item} key={item.id}/>
          ))}
        </div>
      )}
    </div>
  )
}
