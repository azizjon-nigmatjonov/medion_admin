import { Switch } from "@mui/material";
import { useMemo } from "react";
import { useWatch } from "react-hook-form";
import FRow from "../../../../components/FormElements/FRow";
import HFMultipleSelect from "../../../../components/FormElements/HFMultipleSelect";
import HFSelect from "../../../../components/FormElements/HFSelect";
import HFSwitch from "../../../../components/FormElements/HFSwitch";
import listToOptions from "../../../../utils/listToOptions";
import styles from "./style.module.scss";

const MultipleInsertSettings = ({ columns, form }) => {
  const computedColumns = useMemo(() => {
    return listToOptions(columns, "label", "slug");
  }, [columns]);

  const multipleInsert = useWatch({
    control: form.control,
    name: "multiple_insert",
  });

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>Multiple ins</div>
        <HFSwitch control={form.control} name='multiple_insert' />
      </div>

      {multipleInsert && (
        <div className={styles.sectionBody}>
          <div className={styles.formRow}>
            <FRow label='Multiple insert field'>
              <HFSelect
                options={computedColumns}
                control={form.control}
                name='multiple_insert_field'
              />
            </FRow>

            <FRow label='Fixed fields'>
              <HFMultipleSelect
                options={computedColumns}
                control={form.control}
                name='updated_fields'
              />
            </FRow>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultipleInsertSettings;
