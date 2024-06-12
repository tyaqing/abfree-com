import { useTranslation } from 'react-i18next'

import { useGlobalStore } from '@/stores/useGlobalStore'
import { css, cx } from 'styled-system/css'
import { center, vstack } from 'styled-system/patterns'
import { Stack } from '../../styled-system/jsx'
import {Maximize} from "lucide-react";

export function UploadPreview() {
  const store = useGlobalStore()

  const { t } = useTranslation()
  return (
    <div
      className={vstack({
        alignItems: 'stretch',
        px: 4,
      })}
    >
      <div
        className={cx(
          'transparent-square-background group',
          center({
            aspectRatio: '16/8',
            overflow: 'hidden',
            position: 'relative',
            rounded: 'md',
            p: 2,
            borderWidth: '2px!',
            borderColor: 'gray.200',
          }),
        )}
      >
        {store.preview?.[0] && (
          <Stack
            pos={'absolute'}
            bottom={1}
            right={1}
            bg={'white'}
            opacity={0.8}
            px={1}
            rounded={'md'}
            shadow={'md'}
            transition={'opacity 0.2s'}
            className={css({
              fontSize: 'xs',
            })}
            _hover={{
              opacity: '1!important',
            }}
            _groupHover={{
              opacity: 0.3,
            }}
          >
            W:{store.preview[0].width.toFixed(0)}px H:{store.preview[0].height.toFixed(0)}px
          </Stack>
        )}

        {store.preview.map((pre, index) => (
          <img
            width={pre.width}
            height={pre.height}
            key={index}
            className={css({
              maxH: 'full',
              objectFit: 'contain',
            })}
            src={`data:image/png;base64,${pre.base64}`}
            alt=""
          />
        ))}
        {store.preview.length === 0 && (
          <div className={center({})}>
            <div className={vstack()}>
              <Maximize className={'text-md'} />
              <div className={'text-gray-900 font-bold text-sm'}>{t('请点击一个图层')}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
