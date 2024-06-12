import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx'

export default function () {
  return (
    <Tabs
      defaultValue="Web Offline"
      className="w-[240px] center fixed bottom-8 left-[calc(50vw-120px)] flex justify-center"
    >
      <TabsList className={'bottom bg-black rounded-full mx-auto h-10'}>
        <TabsTrigger value="Web Offline" className={'rounded-full cursor-pointer h-8'}>
          Web Offline
        </TabsTrigger>
        <TabsTrigger className={'rounded-full cursor-pointer h-8'} value="Figma Plugin">
          Figma Plugin
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
