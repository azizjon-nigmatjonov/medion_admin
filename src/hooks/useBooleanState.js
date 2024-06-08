import { useState } from "react"


const useBooleanState = (initialValue = false) => {
  const [state, setState] = useState(initialValue)

  const turnOn = () => setState(true)
  const turnOff = () => setState(false)


  return [state, turnOn, turnOff]
}

export default useBooleanState