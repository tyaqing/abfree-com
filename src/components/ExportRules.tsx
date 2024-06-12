import { nanoid } from 'nanoid'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import UploadButton from '@/components/UploadButton'
import { useGlobalStore } from '@/stores/useGlobalStore'
import { Format } from '@/types/interface'
import { EXPORT_RULE_NUM, FORMAT_LIST, SCALE_LIST } from '@/utils/const'
import { hstack } from '../../styled-system/patterns'
import { css } from '../../styled-system/css'
import { HStack, VStack } from '../../styled-system/jsx'
import { FiMinus, FiPlus } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'

export function ExportRules() {
  const store = useGlobalStore()
  const { t } = useTranslation()
  const onAddExportRule = () => {
    // 规则不超过3个
    if (store.exportRules.length >= EXPORT_RULE_NUM) return
    // 如果 1，2，3倍都有了 就添加默认的1倍
    store.addExportRule({
      id: nanoid(),
      scale: 1,
      suffix: ``,
      format: Format.PNG,
    })
  }
  const onRuleScaleChange = (id: string, scale: number) => {
    store.editExportRule(id, { scale })
  }
  const onRuleSuffixChange = (id: string, suffix: string) => {
    store.editExportRule(id, { suffix })
  }
  const onRuleFormatChange = (id: string, format: Format) => {
    store.editExportRule(id, { format })
  }

  return (
    <VStack px={4} pt={2} alignItems={'stretch'}>
      {/*标题*/}
      <HStack alignItems={'stretch'}>
        <div className={hstack()}>
          <div
            className={css({
              fontSize: 'xs',
              fontWeight: 'bold',
            })}
          >
            {t('导出设置')}
          </div>
        </div>
        <div className={'flex-1'} />
        <Button
          disabled={store.exportRules.length >= EXPORT_RULE_NUM}
          onClick={onAddExportRule}
          variant={'ghost'}
          size={'xs'}
          aria-label={'plus'}
        >
          <FiPlus />
        </Button>
      </HStack>
      {/*规则列表*/}
      <VStack alignItems={'stretch'} gap={2}>
        {store.exportRules.map((rule) => (
          <HStack gap={2} key={rule.id}>
            {/*倍率列表*/}
            <Select
              disabled={rule.format === Format.SVG}
              onValueChange={(value: any) => onRuleScaleChange(rule.id, Number(value))}
              defaultValue={String(rule.scale)}
            >
              <SelectTrigger className="flex-[0.6] h-6 text-xs">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent className={''}>
                {SCALE_LIST.map((item, index) => (
                  <SelectItem key={index} value={String(item)}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/*Prefix*/}
            <Input
              autoComplete={''}
              defaultValue={rule.suffix}
              className={'flex-1 h-6 text-xs'}
              onChange={(e) => onRuleSuffixChange(rule.id, e.target?.value)}
              placeholder={'Suffix'}
            />
            {/*格式列表*/}
            <Select
              defaultValue={rule.format}
              onValueChange={(value: any) => onRuleFormatChange(rule.id, value as Format)}
            >
              <SelectTrigger className={'flex-[1.2] h-6 text-xs'}>
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent className={'w-[50px]'}>
                {FORMAT_LIST.map((item, index) => (
                  <SelectItem key={index} value={item.value}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              disabled={store.exportRules.length === 1}
              variant={'ghost'}
              size={'xs'}
              aria-label={'minus'}
              onClick={() => store.removeExportRule(rule.id)}
            >
              <FiMinus />
            </Button>
          </HStack>
        ))}
      </VStack>
      <UploadButton />
    </VStack>
  )
}
