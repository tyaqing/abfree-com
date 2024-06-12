import { HStack, Spacer } from '../../styled-system/jsx'
import { Button } from '@/components/ui/button.tsx'
import { useGlobalStore } from '@/stores/useGlobalStore.ts'
import { startTransition } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip.tsx'
import { useTranslation } from 'react-i18next'
import { Switch } from '@/components/ui/switch.tsx'
import { Label } from '@/components/ui/label.tsx'
import { useUserStore } from '@/stores/useUserStore.ts'
import { useSignal } from '@preact/signals-react'
import { isChannelWoa } from '@/utils/env.ts'
import { CircleUserRound, Copy, Settings } from 'lucide-react'

import { toast } from '@/utils/message.ts'
import { useCopyToClipboard } from 'react-use'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer.tsx'
import { css } from '../../styled-system/css'
interface RightButton {
  icon: JSX.Element
  text: string
  url?: string
  onClick?: () => void
}

export function Header() {
  const store = useGlobalStore()
  const open = useSignal(false)
  const { t } = useTranslation()
  const { woaUser, figmaUser, xid } = useUserStore()
  const [, copyToClipboard] = useCopyToClipboard()
  const onCopy = (val: string) => {
    copyToClipboard(val)
    toast('Copied to clipboard')
  }

  const rightButtons: RightButton[] = []
  rightButtons.unshift({
    icon: isChannelWoa() ? (
      <img
        alt={'avatar'}
        className={'w-4 h-4 rounded-full'}
        src={`https://dayu.woa.com/avatars/${woaUser.value.staffname}/profile.jpg`}
      />
    ) : (
      <CircleUserRound />
    ),
    text: isChannelWoa() ? woaUser.value?.staffname : t('用户信息'),
    onClick: () => (open.value = true),
  })

  const idList = [
    {
      label: 'FigmaName',
      value: figmaUser.value.name,
    },
    {
      label: 'FigmaID',
      value: figmaUser.value.id,
    },
  ]
  if (isChannelWoa()) {
    idList.push(
      ...[
        {
          label: 'WoaID',
          value: woaUser.value?.staffid || '未登录',
        },
        {
          label: 'WoaName',
          value: woaUser.value?.staffname || '未登录',
        },
      ],
    )
  }
  idList.push({
    label: 'XID',
    value: xid.value,
  })

  return (
    <HStack
      px={4}
      py={1}
      bg={'white'}
      fontSize={'xs'}
      pos={'fixed'}
      top={0}
      left={0}
      right={0}
      zIndex={1}
      borderColor={'gray.200'}
      alignItems={'center'}
      className={store.mode === 'inspect' ? 'border-y' : 'border-b'}
    >
      <Button
        onClick={() => {
          startTransition(() => {
            store.setState({
              destinationSheetVisible: true,
            })
          })
        }}
        size={'xs'}
        variant={'ghost'}
      >
        <div className={'text-xs flex items-center gap-1'}>
          <Settings /> {t('设置')}
        </div>
      </Button>
      <Spacer></Spacer>
      {/*右边的按钮*/}
      <HStack divideX={'1px'} gap={0}>
        {rightButtons.map((item, index) => (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <a target={'_blank'} href={item.url} className={'px-1'}>
                  <Button
                    onClick={item.onClick}
                    variant={'ghost'}
                    size={'xs'}
                    className={'px-2 text-xs'}
                  >
                    {item.icon}
                  </Button>
                </a>
              </TooltipTrigger>
              <TooltipContent side={'bottom'} align={'center'}>
                {item.text}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}

        <div className="flex items-center space-x-2 pl-2">
          <Label htmlFor="airplane-mode" className={'flex gap-1 text-xs items-center'}>
            {t('上传')}
          </Label>
          <Switch
            checked={store.uploadConfig.enableUpload}
            id="airplane-mode"
            onCheckedChange={(checked: boolean) => {
              store.setState({
                uploadConfig: {
                  ...store.uploadConfig,
                  enableUpload: checked,
                },
              })
            }}
          />
        </div>
      </HStack>

      {/*用户信息*/}
      <Drawer
        direction={'bottom'}
        open={open.value}
        onOpenChange={(val: boolean) => {
          open.value = val
        }}
      >
        <DrawerContent className={'h-[75vh]'}>
          <DrawerHeader
            className={css({
              py: '2!',
            })}
          >
            <DrawerTitle className={'text-left'}>
              <div>{t('用户信息')}</div>
            </DrawerTitle>
          </DrawerHeader>
          <div className={'p-4 text-sm flex flex-col items-stretch gap-2 '}>
            {idList.map((item, index) => (
              <div key={index} className={'flex flex-col gap-1 '}>
                <div className={'font-bold'}>{item.label} :</div>
                <HStack className={'flex-1'}>
                  <div className={'truncate'}>{item.value}</div>
                  <Button
                    aria-label="download"
                    size={'xs'}
                    variant={'secondary'}
                    onClick={() => onCopy(item.value)}
                  >
                    <Copy></Copy>
                  </Button>
                </HStack>
              </div>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </HStack>
  )
}
