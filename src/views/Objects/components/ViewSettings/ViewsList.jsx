import {
  AccountTree,
  Add,
  CalendarMonth,
  TableChart,
} from "@mui/icons-material";
import IconGenerator from "../../../../components/IconPicker/IconGenerator";
import styles from "./style.module.scss";

const ViewsList = ({ views, selectedView, setSelectedView }) => {
  return (
    <div className={styles.viewsWrapper}>
      <div className={styles.views}>
        {views?.map((view) => (
          <div
            key={view.id}
            className={`${styles.viewRow} ${
              selectedView?.id === view.id ? styles.active : ""
            }`}
            onClick={() => setSelectedView(view)}
          >
            {view.type === "TABLE" && <TableChart className={styles.icon} />}
            {view.type === "CALENDAR" && (
              <CalendarMonth className={styles.icon} />
            )}
            {view.type === "GANTT" && (
              <IconGenerator className={styles.icon} icon="chart-gantt.svg" />
            )}
            {view.type === "CALENDAR HOUR" && (
              <IconGenerator className={styles.icon} icon="chart-gantt.svg" />
            )}
            {view.type === "TREE" && <AccountTree className={styles.icon} />}
            {view.type === "BOARD" && (
              <IconGenerator className={styles.icon} icon="brand_trello.svg" />
            )}
            <div className={styles.viewName}>{view.name ?? view.type}</div>
          </div>
        ))}

        <div
          className={`${styles.viewRow} ${
            selectedView === "NEW" ? styles.active : ""
          }`}
          onClick={() => setSelectedView("NEW")}
        >
          <Add className={styles.icon} />
        </div>
      </div>
    </div>
  );
};

export default ViewsList;
