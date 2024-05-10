import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
export function AstroSelect() {
  const onValueChange = (value: string) => {
  }
  return (
    <Select onValueChange={onValueChange}  defaultValue={''}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={''} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">Light</SelectItem>
        <SelectItem value="zh">Dark</SelectItem>
      </SelectContent>
    </Select>
  )
}