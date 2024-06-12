import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useGlobalStore } from '@/stores/useGlobalStore'
import { LANG_LIST } from '@/utils/const'
import { Globe } from 'lucide-react'

interface I18nButtonProps {
  variant: 'ghost' | 'link'
  iconLeft?: boolean
}
export function I18nButton(props: I18nButtonProps) {
  const globalStore = useGlobalStore()
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={'xs'} variant={props.variant}>
            <div className={'text-xs'}>
              {LANG_LIST.find((lang) => lang.key === globalStore.lang)?.shortName}
            </div>
            <Globe className={'ml-2'} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side={'top'} align={'start'} className="">
          {LANG_LIST.map((lang) => (
            <DropdownMenuCheckboxItem
              checked={globalStore.lang === lang.key}
              onClick={() => globalStore.changeLang(lang.key)}
              key={lang.key}
            >
              <div className={'flex'}>
                <div>{lang.name}</div>
                <div className={'flex-1'} />
              </div>
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
