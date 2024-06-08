import { useMemo } from "react";
import FRow from "../../../../components/FormElements/FRow";
import HFSelect from "../../../../components/FormElements/HFSelect";
import listToOptions from "../../../../utils/listToOptions";
import styles from "./style.module.scss";

const CalendarHourSettings = ({ columns, form }) => {
  const computedColumns = useMemo(() => {
    return listToOptions(columns, "label", "slug");
  }, [columns]);

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>Calendar Hour settings</div>
      </div>

      <div className={styles.sectionBody}>
        <div className={styles.formRow}>
          <FRow label="Date field">
            <HFSelect
              options={computedColumns}
              control={form.control}
              name="calendar_from_slug"
            />
          </FRow>
          <div style={{ minWidth: "50%" }}></div>
        </div>
      </div>
    </div>
  );
};

export default CalendarHourSettings;
