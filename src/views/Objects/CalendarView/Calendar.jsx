import CalendarColumn from "./CalendarColumn"
import styles from "./style.module.scss"
import TimesColumn from "./TimesColumns"
import { FixedSizeList } from "react-window"
import { useRef } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"

const Calendar = ({ data, fieldsMap, datesList, view, tabs, workingDays }) => {
  const parentRef = useRef(null)

  const virtualizer = useVirtualizer({
    horizontal: true,
    count: datesList?.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 500,
  })

  return (
    <div className={styles.calendar} ref={parentRef} >
      <TimesColumn view={view} />

      <div
        style={{
          width: virtualizer.getTotalSize(),
          height: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualColumn) => (
          <div
            key={virtualColumn.key}
            data-index={virtualColumn.index}
            ref={virtualizer.measureElement}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              transform: `translateX(${virtualColumn.start}px)`,
            }}
          >
            <CalendarColumn
            date={datesList[virtualColumn.index]}
            data={data}
            fieldsMap={fieldsMap}
            view={view}
            tabs={tabs}
            workingDays={workingDays}
          />
          </div>
        ))}

        </div>


        {/* {datesList?.map((date) => (
          <CalendarColumn
          date={date}
          data={data}
          fieldsMap={fieldsMap}
          view={view}
          tabs={tabs}
          workingDays={workingDays}
        />
        ))} */}
    </div>
  )
}

export default Calendar
