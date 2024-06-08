import DatesRow from "./DatesRow";
import RecursiveBlock from "./RecursiveBlock";
import styles from "./style.module.scss";

const Gantt = ({ data, period, fieldsMap, datesList, view, tabs }) => {
  return (
    <div className={styles.gantt}>
      <DatesRow period={period} tabs={tabs} datesList={datesList} />

      <RecursiveBlock
        period={period}
        data={data}
        fieldsMap={fieldsMap}
        view={view}
        tabs={tabs}
        datesList={datesList}
      />
    </div>
  );
};

export default Gantt;
