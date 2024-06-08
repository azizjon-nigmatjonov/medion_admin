import { format } from "date-fns";
import { useMemo } from "react";
import {
  calculateGantCalendarMonths,
  calculateGantCalendarWeeks,
  calculateGantCalendarYears,
} from "../../../utils/calculateGantCalendar";
import styles from "./style.module.scss";

const DatesRow = ({ datesList, tabs, period }) => {
  const blocksCount = useMemo(() => {
    return [
      {
        id: tabs[0]?.id,
        list: tabs[0]?.list?.filter((p) =>
          tabs[1]?.list.some((c) => c.cabinets_id === p.value)
        ),
      },
      tabs[1],
    ].reduce((acc, cur) => acc + cur?.list?.length, 0);
  }, [tabs]);

  const computedDatesList = useMemo(() => {
    return period === "years"
      ? calculateGantCalendarYears(datesList)
      : period === "months"
      ? calculateGantCalendarMonths(datesList)
      : calculateGantCalendarWeeks(datesList);
  }, [datesList, period]);

  const isWeekend = (date) => {
    return new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
  };

  return (
    <div className={styles.datesRow}>
      <div className={styles.mockBlock} />

      {computedDatesList.map((dateItem) => (
        <div className={styles.dateBlock}>
          <div className={styles.monthBlock}>
            <span className={styles.monthText}>{dateItem[0]}</span>
          </div>

          <div className={styles.daysRow}>
            {dateItem[1]?.map((date) => (
              <div
                className={`${styles.dayBlock} }`}
                style={{
                  width: "160px",
                  backgroundColor: isWeekend(date) ? "#ffccbb" : "",
                }}
              >
                <div
                  className={`${
                    date.toDateString() === new Date().toDateString()
                      ? styles.today
                      : ""
                  }`}
                >
                  <div
                    className={styles.line}
                    blocksCount={"100"}
                    style={{ height: `${blocksCount * 48}px` }}
                  ></div>
                </div>
                <div>{format(date, period === "years" ? "MMMM" : "dd")}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DatesRow;
