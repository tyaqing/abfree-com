import { useTranslation } from 'react-i18next'
import { Icon } from '@chakra-ui/react'

export default function () {
  const features = [
    {
      title: 'Index.feature1',
      description: 'Index.feature1Desc',
      link: '/',
      icon: 'wasm',
    },
    {
      title: 'Index.feature2',
      description: 'Index.feature2Desc',
      link: '/',
      icon: 'lucide:images',
    },
    {
      title: 'Index.feature3',
      description: 'Index.feature3Desc',
      link: '/',
      icon: 'lucide:shield-check',
    },
  ]
  const { t } = useTranslation()
  return (
    <section>
      <div className="pb-6 pt-14">
        <HeaderSection title={t('MainNav.特性')} subtitle={t('Index.featureBefore')} />

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div className="group relative overflow-hidden rounded-2xl border bg-background p-5 md:p-8">
              <div
                aria-hidden="true"
                className="absolute inset-0 aspect-video -translate-y-1/2 rounded-full border bg-gradient-to-b from-purple-500/80 to-white opacity-25 blur-2xl duration-300 group-hover:-translate-y-1/4 dark:from-white dark:to-white dark:opacity-5 dark:group-hover:opacity-10"
              />
              <div className="relative">
                <div className="relative flex size-12 rounded-2xl border border-border shadow-sm *:relative *:m-auto *:size-6 ">
                  <Icon name={feature.icon} className="size-4" />
                </div>
              </div>
              <h3 className="mt-6 text-md font-semibold">{t(feature.title)}</h3>
              <p className="mt-6 pb-6 text-muted-foreground">{t(feature.description)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

interface HeaderSectionProps {
  label?: string
  title: string
  subtitle: string
}

function HeaderSection({ label, title, subtitle }: HeaderSectionProps) {
  return (
    <div className="flex flex-col items-center text-center">
      {label ? <div className="text-gradient_indigo-purple mb-4 font-semibold">{label}</div> : null}
      <h2 className="text-gradient_indigo-purple font-bold font-heading text-3xl md:text-4xl lg:text-[40px]">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-6 text-balance text-lg text-muted-foreground">{subtitle}</p>
      ) : null}
    </div>
  )
}
