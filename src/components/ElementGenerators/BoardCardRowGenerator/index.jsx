import { get } from "@ngard/tiny-get";
import { format } from "date-fns";
import { useMemo } from "react";
import { getRelationFieldTableCellLabel } from "../../../utils/getRelationFieldLabel";
import MultiselectCellColoredElement from "../MultiselectCellColoredElement";
import styles from "./style.module.scss";

const BoardCardRowGenerator = ({ field, el }) => {
  const value = useMemo(() => {
    if (field.type !== "LOOKUP") return get(el, field.slug, "");
    return getRelationFieldTableCellLabel(
      field,
      el,
      field.slug + "_data"
    );;
  }, [field, el]);

  switch (field?.type) {
    case "PHOTO":
      return (
        <div key={field.id} className={styles.row}>
          <div className={styles.label}>{field.label}:</div>
          <img src={value} alt="board_image" className={styles.image} />
        </div>
      );

    case "MULTISELECT":
      return (
        <div key={field.id} className={styles.row}>
          <div className={styles.label}>{field.label}:</div>
          <MultiselectCellColoredElement
            value={value}
            field={field}
            style={{ padding: "2px 5px" }}
          />
        </div>
      );

    case "DATE":
      return (
        <div key={field.id} className={styles.row}>
          <div className={styles.label}>{field.label}:</div>
          <div className={styles.value}>
            {value ? format(new Date(value), "dd.MM.yyyy") : "---"}
          </div>
        </div>
      );

    case "DATE_TIME":
      return (
        <div key={field.id} className={styles.row}>
          <div className={styles.label}>{field.label}:</div>
          <div className={styles.value}>
            {value ? format(new Date(value), "dd.MM.yyyy HH:mm") : "---"}
          </div>
        </div>
      );

    default:
      return (
        <div key={field.id} className={styles.row}>
          <div className={styles.label}>{field.label}:</div>
          <div className={styles.value}>{value}</div>
        </div>
      );
  }
};

export default BoardCardRowGenerator;
