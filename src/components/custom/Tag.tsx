import classNames from "classnames";

export function Tag({
                      children,
                      className,
                      style,
                    }: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div
      style={style}
      className={
        classNames(className, {
          px: 1,
          py: '0px',
          fontSize: 'xs',
          rounded: 'xs',
          color: 'white',
          fontWeight: 'bold',
        })}
    >
      {children}
    </div>
  )
}
