import { zodResolver } from '@hookform/resolvers/zod'
import ReactCodeMirror from '@uiw/react-codemirror'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { UploadConfig, UploadType, useGlobalStore } from '@/stores/useGlobalStore'
import { toast } from '@/utils/message'
import { Tag } from '@/components/custom/Tag'
import { HStack } from '../../styled-system/jsx'
import { isChannelWoa } from '@/utils/env.ts'
import { LINK } from '@/utils/const.ts'
import { ExternalLink, Save } from 'lucide-react'

export default function UploadConfigForm() {
  const store = useGlobalStore()
  const { t } = useTranslation()

  const isJson = (value: string) => {
    try {
      if (value === '') return true
      JSON.parse(value)
      return true
    } catch {
      return false
    }
  }
  const formSchema = z.object({
    imgHost: z.string().url(),
    customHeaders: z.string().refine(isJson, {
      message: 'Invalid JSON format',
    }),
    // 检查是否为json格式
    customBody: z.string().refine(isJson, {
      message: 'Invalid JSON format',
    }),
  })
  // 1. Define your form.
  const form = useForm<UploadConfig>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imgHost: store.uploadConfig.imgHost,
      customHeaders: store.uploadConfig.customHeaders,
      customBody: store.uploadConfig.customBody,
    },
  })
  const onSubmit = async (values: UploadConfig) => {
    console.log(values)
    store.setState({
      uploadConfig: {
        ...store.uploadConfig,
        ...values,
      },
    })
    toast('Saved')
  }

  const Protocol = isChannelWoa() ? ProtocolWoa : ProtocolDefault
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex-1 space-y-2 p-4 pb-6 overflow-scroll"
      >
        {/* 上传开关 */}
        <FormField
          control={form.control}
          name="enableUpload"
          render={() => (
            <FormItem>
              <FormLabel>{t('开启上传')}</FormLabel>
              <FormControl>
                <div>
                  <Switch
                    checked={store.uploadConfig.enableUpload}
                    onCheckedChange={(checked: boolean) => {
                      store.setState({
                        uploadConfig: {
                          ...store.uploadConfig,
                          enableUpload: checked,
                        },
                      })
                    }}
                    id="airplane-mode"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* 上传服务 */}
        <FormField
          control={form.control}
          name="useCustomUpload"
          render={() => (
            <FormItem>
              <FormLabel>{t('上传服务')}</FormLabel>
              <FormControl>
                <RadioGroup
                  orientation={'horizontal'}
                  onValueChange={(value: any) => {
                    store.setState({
                      uploadConfig: {
                        ...store.uploadConfig,
                        useCustomUpload: value,
                      },
                    })
                  }}
                  defaultValue={store.uploadConfig.useCustomUpload}
                  className="flex "
                >
                  <FormItem className="flex items-center space-x-2 space-y-0  ">
                    <FormControl>
                      <RadioGroupItem value="free" />
                    </FormControl>
                    <FormLabel className="font-normal leading-1 cursor-pointer">
                      <HStack gap={1}>
                        <div>{isChannelWoa() ? t('测试图床') : t('免费图床')}</div>
                        <Tag className={'bg-yellow-400 text-yellow-900 py-1!'}>
                          {isChannelWoa() ? t('7D') : t('Free')}
                        </Tag>
                      </HStack>
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0 ">
                    <FormControl>
                      <RadioGroupItem value="custom" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">{t('自定义图床')}</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {store.uploadConfig.useCustomUpload === UploadType.CUSTOM && (
          <>
            {/*上传地址*/}
            <FormField
              control={form.control}
              name="imgHost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('上传地址')}</FormLabel>
                  <FormControl>
                    <Input {...field} className={'h-6 px-2'} />
                  </FormControl>
                  <FormDescription className={'flex'}>
                    {t('您上传服务的地址')}
                    <a
                      href={LINK.uploadHelp}
                      className={'underline flex items-center gap-1 ml-1'}
                      target={'_blank'}
                    >
                      {t('如何使用?')}
                      <ExternalLink></ExternalLink>
                    </a>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/*上传body*/}
            <FormField
              control={form.control}
              name="customBody"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('自定义 Body')}</FormLabel>
                  <FormControl>
                    <ReactCodeMirror {...field} />
                  </FormControl>
                  <FormDescription>{t('JSON格式')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/*上传头部*/}
            <FormField
              control={form.control}
              name="customHeaders"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('自定义 Headers')}</FormLabel>
                  <FormControl>
                    <ReactCodeMirror {...field} />
                  </FormControl>
                  <FormDescription>{t('JSON格式,请注意跨域问题')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button size={'sm'} type="submit" className={'w-full flex gap-1 text-sm'}>
              {t('保存')} <Save></Save>
            </Button>
          </>
        )}
        {store.uploadConfig.useCustomUpload === UploadType.FREE && <Protocol></Protocol>}
      </form>
    </Form>
  )
}

function ProtocolWoa() {
  return (
    <div className={'!mt-6 text-sm text-gray-500 leading-[1.6]'}>
      测试图床仅用于体验测试,链接有效期7天, <b className={'text-red-500'}>请勿上传敏感图片</b>{' '}
      ,建议您使用[自定义图床]部署自己的图床服务.
      <a href={LINK.uploadHelp} className={'underline flex items-center gap-1'} target={'_blank'}>
        如何部署自己的服务?
        <ExternalLink></ExternalLink>
      </a>
    </div>
  )
}

function ProtocolDefault() {
  const t = useTranslation().t
  return (
    <div className={'!mt-6 text-xs text-gray-500 leading-[1.6]'}>
      {/* 免费图床使用协议 */}
      <div className={'font-bold mb-2'}>{t('protocolTitle')}:</div>
      <a
        href="https://www.abfree.com/blog/en/exportx-upload-protocol"
        className={'underline flex items-center gap-1'}
        target={'_blank'}
      >
        {t('使用条款')}
        <ExternalLink></ExternalLink>
      </a>
      <br />
    </div>
  )
}
