import { I18nButton } from '@/components/I18nButton'
import { Button } from '@/components/ui/button'

import packageJson from '../../package.json'
import { AspectRatio, Center, HStack, VStack } from '../../styled-system/jsx'
import { isChannelWoa, isRuntimeDev } from '@/utils/env'
import { Tag } from '@/components/custom/Tag'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog.tsx'

import { useState } from 'react'
import { ExternalLink, Mail } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LINK } from '@/utils/const.ts'

export default function CopywriterFooter() {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()
  return (
    <Center>
      <HStack mt={2} gap={2}>
        {!isChannelWoa() && <I18nButton variant={'link'} />}
        <a href={LINK.help} target={'_blank'}>
          <Button size={'xs'} variant={'link'}>
            {t('帮助文档')}
          </Button>
        </a>
        <Button
          size={'xs'}
          variant={'link'}
          onClick={() => {
            if (isChannelWoa()) return
            setOpen(true)
          }}
        >
          V{packageJson.version}{' '}
          {isRuntimeDev() && <Tag className={'bg-purple-600 ml-2'}> DEV</Tag>}
        </Button>
        <Dialog
          open={open}
          onOpenChange={(value) => {
            setOpen(value)
          }}
        >
          <DialogContent className={'w-[86vw] !p-4'}>
            <VStack alignItems={'stretch'}>
              <AspectRatio w={'50px'} ratio={1}>
                <img src="https://dev.cdn.abfree.com/images/r1NJ47RyLuKuFOxl.svg" alt="" />
              </AspectRatio>
              <DialogTitle>ExportX {packageJson.version} </DialogTitle>
              <div className={'text-xs text-gray-600'}>
                Made by ABFree <br /> Updated on 2024-04-22
              </div>
              <HStack>
                <a href={'mailto:exportx@abfree.com'} target={'_blank'}>
                  <Button variant={'outline'} size={'xs'} className={'flex gap-1'}>
                    Feedback <Mail></Mail>
                  </Button>
                </a>
                <a href={'https://www.abfree.com/blog'} target={'_blank'}>
                  <Button variant={'outline'} size={'xs'} className={'flex gap-1'}>
                    HomePage <ExternalLink></ExternalLink>
                  </Button>
                </a>
              </HStack>
            </VStack>
          </DialogContent>
        </Dialog>
      </HStack>
    </Center>
  )
}
