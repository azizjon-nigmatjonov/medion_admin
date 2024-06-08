import { useMemo } from "react";
import FRow from "../../../../components/FormElements/FRow";
import HFSelect from "../../../../components/FormElements/HFSelect";
import listToOptions from "../../../../utils/listToOptions";
import styles from "./style.module.scss";

const GanttSettings = ({ columns, form }) => {
  const computedColumns = useMemo(() => {
    return listToOptions(columns, "label", "slug");
  }, [columns]);

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>Gantt settings</div>
      </div>

      <div className={styles.sectionBody}>
        <div className={styles.formRow}>
          <FRow label="Date from field">
            <HFSelect
              options={computedColumns}
              control={form.control}
              name="calendar_from_slug"
            />
          </FRow>
          <FRow label="Date to field">
            <HFSelect
              options={computedColumns}
              control={form.control}
              name="calendar_to_slug"
            />
          </FRow>
        </div>
      </div>
    </div>
  );
};

export default GanttSettings;
