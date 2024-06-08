import { format } from "date-fns"
import { useMemo } from "react"
import useTimeList from "../../../hooks/useTimeList"
import styles from "./style.module.scss"

const MockColumn = ({ view, level, tabs }) => {

  const mockTabBlocks = useMemo(() => {
    return new Array(tabs?.length - level)?.fill('')
  }, [tabs, level])

  const { timeList } = useTimeList(view.time_interval)

  return (
    <div className={styles.objectColumn}>
      {mockTabBlocks?.map((el, index) => (
        <div
          key={index}
          className={`${styles.timeBlock} ${styles.disabled}`}
          style={{ overflow: "auto" }}
        >
        </div>
      ))}

      {timeList.map((time, index) => (
        <div
          key={time}
          className={`${styles.timeBlock} ${styles.disabled}`}
          style={{ overflow: "auto" }}
        >
          <div className={styles.timePlaceholder}>{format(time, "HH:mm")}</div>
        </div>
      ))}
    </div>
  )
}

export default MockColumn
