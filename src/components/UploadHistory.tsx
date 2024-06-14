import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import UploadCard from '@/components/UploadCard'
import { useProcessingStore } from '@/stores/useProcessingStore'
import { HISTORY_NUM } from '@/utils/const'
import { HStack, Spacer, VStack } from '../../styled-system/jsx'
import { report } from '@/utils/report'
import { useHotkeys } from 'react-hotkeys-hook'
import { CircleHelp, LayoutGrid } from 'lucide-react'

export default function UploadHistory() {
  const processingStore = useProcessingStore()
  const { t } = useTranslation()
  // 监听快捷键
  useHotkeys(['control+k'], () => {
    report('clearHistory')
    processingStore.clear()
  })
  return (
    <VStack alignItems={'stretch'} pt={2} flex={1} bg={''}>
      {/*标题区域*/}
      <HStack alignItems={'center'} gap={2} px={4}>
        <div className={'text-xs font-bold'}>
          {t('历史记录')}
          {processingStore.processingList.length
            ? `(${processingStore.processingList.length})`
            : ''}
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className={'text-sm'} size={'xs'} variant={'ghost'}>
                <CircleHelp />
              </Button>
            </TooltipTrigger>
            <TooltipContent side={'bottom'} align={'center'}>
              <p> {t('仅保存n条本地记录', { num: HISTORY_NUM })}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Spacer></Spacer>
        {processingStore.processingList.length > 0 && (
          <Button
            size={'xs'}
            variant={'link'}
            className={'text-red-500 text-xs'}
            onClick={() => {
              report('clearHistory')
              processingStore.clear()
            }}
          >
            {t('清空')}
          </Button>
        )}
      </HStack>
      <VStack  alignItems={'stretch'} className={' divide-y-[1px] gap-0'}>
        {processingStore.processingList.length === 0 && (
          <div className={'flex items-center justify-center min-h-[100px]'}>
            <HStack>
              <LayoutGrid />
              <div className={'text-xs font-bold '}>{t('无记录')}</div>
            </HStack>
          </div>
        )}
        {processingStore.processingList.map((uploadInfo) => (
          <UploadCard data={uploadInfo} key={uploadInfo.id} />
        ))}
      </VStack>
    </VStack>
  )
}
