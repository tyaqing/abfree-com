import { css, cx } from 'styled-system/css'

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
      className={cx(
        css({
          px: 1,
          py: '0px',
          fontSize: 'xs',
          rounded: 'xs',
          color: 'white',
          fontWeight: 'bold',
        }),
        className,
      )}
    >
      {children}
    </div>
  )
}
