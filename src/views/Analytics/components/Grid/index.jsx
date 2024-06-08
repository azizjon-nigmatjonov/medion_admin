import { cloneElement } from "react"
import { useResizeDetector } from "react-resize-detector"

const Grid = ({ children, layoutIsEditable }) => {
  const { width = 100, ref } = useResizeDetector({
    handleHeight: false,
    refreshMode: "debounce",
    refreshRate: 100,
  })

  const computedWidth = width / 36

  if(!layoutIsEditable) return <div ref={ref} >{cloneElement(children, { rowHeight: computedWidth })}</div> 

  return (
    <div
      ref={ref}
      style={{
        backgroundSize: `${computedWidth}px ${computedWidth}px`,
        borderRadius: 6,
        minHeight: '100vh',
        border: "1px solid #D5DADD",
        backgroundImage: `repeating-linear-gradient(
    0deg,
    #D5DADD,
    #D5DADD 1px,
    transparent 1px,
    transparent ${computedWidth}px
  ),
  repeating-linear-gradient(
    -90deg,
    #D5DADD,
    #D5DADD 1px,
    transparent 1px,
    transparent ${computedWidth}px
  )`,
      }}
    >
      {cloneElement(children, { rowHeight: computedWidth })}
    </div>
  )
}

export default Grid
