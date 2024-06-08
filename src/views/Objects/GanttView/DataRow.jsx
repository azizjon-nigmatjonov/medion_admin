import { Add } from "@mui/icons-material";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import useTabRouter from "../../../hooks/useTabRouter";
import { calculateGantCalendarYears } from "../../../utils/calculateGantCalendar";
import DataBlock from "./DataBlock";
import styles from "./style.module.scss";

const DataRow = ({ tab, datesList, view, fieldsMap, period, data }) => {
  const { tableSlug } = useParams();
  const { navigateToForm } = useTabRouter();

  const rowWidth = datesList?.length * 160 + 200;

  const navigateToCreatePage = (date) => {
    const startTimeStampSlug = view?.calendar_from_slug;
    navigateToForm(tableSlug, "CREATE", null, {
      [startTimeStampSlug]: date,
      [tab?.slug]: tab?.value,
      ...tab,
    });
  };

  const computedDateList = useMemo(() => {
    if (datesList?.length) {
      if (period === "years") {
        return calculateGantCalendarYears(datesList).reduce(
          (acc, cur) => [...acc, ...cur[1]],
          []
        );
      }
      return datesList;
    }
    return [];
  }, [datesList, period]);

  const computedData = useMemo(() => {
    const result = {};

    data?.forEach((el) => {
      if (el[tab.slug] === tab.value) {
        result[el?.calendar?.date] = el;
      }
    });

    return result;
  }, [data, tab]);

  return (
    <div className={styles.row} style={{ width: rowWidth }}>
      <div
        className={`${styles.tabBlock}`}
        style={{ paddingLeft: 20, zIndex: 1 }}
      >
        {tab.label}
      </div>
      {period !== "years" &&
        Object.entries(computedData)?.map((data) => (
          <DataBlock
            data={data}
            view={view}
            fieldsMap={fieldsMap}
            computedDateList={computedDateList}
          />
        ))}

      {computedDateList?.map((date) => (
        <div
          key={date}
          className={`${styles.dataBlock}`}
          onClick={() => navigateToCreatePage(date)}
        >
          <Add />
        </div>
      ))}
    </div>
  );
};

export default DataRow;
