import { CircularProgress } from "@mui/material"
import { forwardRef } from "react"
import "./style.scss"

const RectangleIconButton = forwardRef(({
  color,
  children,
  loader,
  className,
  size="",
  onClick = () => {},
  ...props
}, ref) => {
  return (
    <div
      className={`RectangleIconButton ${color} ${className} ${size}`}
      onClick={(e) => {
        e.stopPropagation()
        onClick(e)
      }}
      ref={ref}
      {...props}
    >
      {loader ? <CircularProgress size={14} /> : children}
    </div>
  )
})

export default RectangleIconButton
