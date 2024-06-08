import cascadingService from "../../../../../services/cascadingService";
import styles from "./style.module.scss";
import { useEffect, useMemo, useState } from "react";
import HFSelect from "../../../../../components/FormElements/HFSelect";

const CascadingTreeBlock = ({ control, slug, setValue }) => {
  const [relations, setRelation] = useState();

  const handleChange = (value) => {
    const selectedRelation = relations?.find((item) => {
      return item?.table?.slug === value;
    });
    setValue("cascading_tree_field_slug", selectedRelation?.field_slug);
    setValue("cascadings", []);
  };

  const computedTablesList = useMemo(() => {
    return relations?.map((element) => ({
      value: element?.table?.slug,
      label: element?.table?.label,
    }));
  }, [relations]);

  useEffect(() => {
    cascadingService
      .getList({
        table_slug: slug,
      })
      .then((res) => {
        setRelation(res?.data?.cascadings);
      });
  }, []);

  return (
    <>
      <div className={styles.settingsBlockHeader}>
        <h2>Cascading Tree</h2>
      </div>
      <div className="p-2">
        <div className={styles.input_control}>
          <HFSelect
            control={control}
            options={computedTablesList}
            name="cascading_tree_table_slug"
            onChange={handleChange}
          />
        </div>
      </div>
    </>
  );
};

export default CascadingTreeBlock;
