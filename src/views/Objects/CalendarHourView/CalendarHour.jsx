import DatesRow from "./DatesRow";
import RecursiveBlock from "./RecursiveBlock";
import styles from "./style.module.scss";

const CalendarHour = ({ data, fieldsMap, datesList, view, tabs }) => {
  return (
    <div className={styles.gantt}>
      <DatesRow datesList={datesList} />

      <RecursiveBlock
        data={data}
        fieldsMap={fieldsMap}
        view={view}
        tabs={tabs}
        datesList={datesList}
      />
    </div>
  );
};

export default CalendarHour;
