import { useMemo } from "react";
import DataBlock from "./DataBlock";
import styles from "./style.module.scss";

const DataRow = ({ tab, datesList, view, fieldsMap, data }) => {
  const computedData = useMemo(() => {
    const result = {};

    data?.forEach((el) => {
      if (el[tab.slug] === tab.value) {
        result[el?.calendar?.date] = el;
      }
    });

    return result;
  }, [data, tab]);

  const rowWidth = datesList?.length * 160 + 200;

  return (
    <div className={styles.row} style={{ width: rowWidth }}>
      <div className={`${styles.tabBlock}`} style={{ paddingLeft: 20 }}>
        {" "}
        {tab.label}{" "}
      </div>

      {datesList?.map((date) => (
        <DataBlock
          computedData={computedData}
          date={date}
          view={view}
          fieldsMap={fieldsMap}
          tab={tab}
        />
      ))}
    </div>
  );
};

export default DataRow;
