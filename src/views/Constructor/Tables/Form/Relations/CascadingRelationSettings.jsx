import { useQuery } from "react-query";
import cascadingService from "../../../../../services/cascadingService";
import styles from "./style.module.scss";
import Menu from "@mui/material/Menu";
import { useMemo, useState } from "react";
import CascadingRecursiveBlock from "./CascadingRecursiveBlock";
import { Button } from "@mui/material";
import { Clear } from "@mui/icons-material";

const CascadingRelationSettings = ({
  control,
  watch,
  slug,
  setValue,
  field_slug,
}) => {
  const [relations, setRelation] = useState();
  const cascading = watch("cascadings");
  const [menu, setMenu] = useState(null);
  const open = Boolean(menu);

  const handleClick = (e) => {
    setMenu(e.currentTarget);
    setValue("cascading_tree_table_slug", "");
    setValue("cascading_tree_field_slug", "");
    cascadingService
      .getList({
        table_slug: slug,
      })
      .then((res) => {
        setRelation(res?.data?.cascadings);
      });

    setValue("cascadings", [{ table_slug: slug, field_slug: field_slug }]);
  };
  const handleClose = () => {
    setMenu(null);
  };
  
  const handleClear = () => {
    setValue('cascadings', [])
  }

  const cascadingValue = useMemo(() => {
    let value = "";
    for (let i = 1; i < cascading?.length; i++) {
      value += `${cascading[i]?.label} => `;
    }
    return value.slice(0, -4); // remove the last " => "
  }, [cascading]);

  return (
    <>
      <div className={styles.settingsBlockHeader}>
        <h2>Cascading</h2>
      </div>
      <div className="p-2">
        <div className={styles.input_control}>
          <span onClick={handleClick}>
            <input
              type="text"
              disabled
              value={cascadingValue && cascadingValue}
              className={styles.cascading_input}
              placeholder="value"
              control={control}
            />
          </span>
          {cascadingValue && <button onClick={handleClear} className={styles.clear_btn}><Clear /></button>}
        </div>
        <Menu anchorEl={menu} open={open} onClose={handleClose}>
          <div className={styles.cascading_collapse}>
            <CascadingRecursiveBlock
              fields={relations}
              cascading={cascading}
              setValue={setValue}
              handleClose={handleClose}
            />
          </div>
        </Menu>
      </div>
    </>
  );
};

export default CascadingRelationSettings;
