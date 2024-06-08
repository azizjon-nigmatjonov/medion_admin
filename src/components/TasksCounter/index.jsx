import { useMemo } from "react"
import "./style.scss"

const TasksCounter = ({ element }) => {

  const computedStatusColor = useMemo(() => {
    if(!element.count_done || !element.count_all) return 'red'
    if(!Number(element.count_done) || !Number(element.count_all)) return 'red'

    const percentage = parseInt(Number(element.count_done) * 100 / Number(element.count_all))

    if(percentage < 40) return 'red'
    if(percentage < 80) return 'yellow'
    return 'green'
    
  }, [element.count_done, element.count_all])

  return (
    <div className={`TasksCounter ${computedStatusColor}`} >
      {element?.count_done || 0} / {element?.count_all || 0}
    </div>
  )
}

export default TasksCounter
