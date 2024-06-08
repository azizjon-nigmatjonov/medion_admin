import React, { useState, useMemo } from "react";
import { Collapse, ListItemText, ListItem, Button } from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import cascadingService from "../../../../../services/cascadingService";
import styles from "./style.module.scss";
import CascadingRecursiveBlock from "./CascadingRecursiveBlock";

function CascadingCollapse({ item, level, cascading, setValue, handleClose }) {
  const [collaspseIsOpen, setCollapseIsOpen] = useState(false);
  const [relations, setRelation] = useState();

  const handleCollapse = () => {
    setCollapseIsOpen(!collaspseIsOpen);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (level === 1) {
      cascadingService
        .getList({
          table_slug: item?.table?.slug,
        })
        .then((res) => {
          setRelation(res?.data?.cascadings);
        });
    } else if (level === 2) {
      cascadingService
        .getList({
          table_slug: item?.table?.slug,
        })
        .then((res) => {
          setRelation(res?.data?.cascadings);
        });
    } else if (level === 3) {
      handleClose();
    }
    // debugger;
    setValue("cascadings", [
      ...cascading,
      {
        // order: index,
        table_slug: item?.table?.slug,
        label: item?.table?.label,
        field_slug: item?.field_slug,
      },
    ]);
  };
  return (
    <div className={styles.cascading_collapse_item} onClick={handleClick}>
      <ListItem button onClick={handleCollapse}>
        <ListItemText primary={item?.table?.label} />
        {item.field_slug && level < 3 ? <ExpandMoreIcon /> : ""}
      </ListItem>
      <div className={styles.collapse_item}>
        {relations && (
          <Collapse in={collaspseIsOpen} timeout="auto" unmountOnExit>
            <CascadingRecursiveBlock
              fields={relations}
              level={level + 1}
              cascading={cascading}
              setValue={setValue}
              handleClose={handleClose}
            />
          </Collapse>
        )}
      </div>
    </div>
  );
}

export default CascadingCollapse;
