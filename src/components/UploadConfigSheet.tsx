import { useTranslation } from 'react-i18next'

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { useGlobalStore } from '@/stores/useGlobalStore'
import { css } from '../../styled-system/css'
import { lazy, Suspense } from 'react'
const UploadConfigForm = lazy(() => import('@/components/UploadConfigForm'))

export default function UploadConfigSheet() {
  const store = useGlobalStore()
  const { t } = useTranslation()
  return (
    <Suspense fallback={<div>loading...</div>}>
      <Drawer
        open={store.destinationSheetVisible}
        onOpenChange={(open: boolean) => {
          store.setState({
            destinationSheetVisible: open,
          })
        }}
      >
        <Suspense fallback={<div>loading...</div>}>
          <DrawerContent className={'h-[75vh]'}>
            <DrawerHeader
              className={css({
                py: '2!',
              })}
            >
              <DrawerTitle className={'text-left'}>
                <div>{t('上传配置')}</div>
              </DrawerTitle>
            </DrawerHeader>
            <UploadConfigForm />
          </DrawerContent>
        </Suspense>
      </Drawer>
    </Suspense>
  )
}
