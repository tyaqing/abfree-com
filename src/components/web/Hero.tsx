import { cn } from '@/lib/utils.ts'
import { buttonVariants } from '@/components/ui/button.tsx'
import packages from '../../../package.json'
import { useTranslation } from 'react-i18next'
import { ArrowRight, BookOpenText, Figma } from 'lucide-react'
export default function () {
  const { t } = useTranslation()

  return (
    <section className="space-y-6 py-12 sm:py-20 lg:py-20">
      <div className=" flex max-w-5xl flex-col  gap-5 text-left">
        <a
          href={''}
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'px-4 rounded-full text-sm w-min',
          )}
          target="_blank"
        >
          <span className="mr-3">🎉</span> {t('Index.最新版本')} {packages.version}
          &nbsp;
          <span className="text-gradient_indigo-purple">{t('Index.压缩速度提升 X500%')}</span>
        </a>

        <h1 className="text-balance font-heading text-4xl sm:text-5xl md:text-6xl lg:text-[66px] font-bold">
          {t('Index.h1')}{' '}
          <span className="text-gradient_indigo-purple font-extrabold">{t('Index.h1_append')}</span>
        </h1>

        <p className="max-w-2xl text-balance leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          {t('Index.h2')}
        </p>

        <div className="flex space-x-2 md:space-x-4">
          <a
            target="_blank"
            href={'https://www.figma.com/community/plugin/1301958586584763919'}
            className={cn(buttonVariants({ size: 'lg' }), 'gap-2 rounded-full')}
          >
            <Figma />
            <span>{t('Index.Figma 插件')}</span>
            <ArrowRight></ArrowRight>
          </a>
          <a
            href={''}
            rel="noreferrer"
            className={cn(
              buttonVariants({
                variant: 'outline',
                size: 'lg',
              }),
              'px-5 rounded-full',
            )}
          >
            <BookOpenText className={'mr-2'} />
            <p>
              <span className="hidden sm:inline-block">{t('Index.使用文档')}</span>
            </p>
          </a>
        </div>
      </div>
    </section>
  )
}
