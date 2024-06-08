import styles from "./style.module.scss";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

const TableOrderingButton = ({ value, onChange }) => {
  const clickHandler = () => {
    if (value === -1) onChange(1);
    else if (value === 1) onChange(undefined);
    else onChange(-1);
  };
  return (
    <div className={styles.button} onClick={clickHandler}>
      <ExpandLess
          className={`${styles.icon} ${styles.up} ${
              value === 1 ? styles.active : value === undefined ? '' : styles.nonVisible
          }`}
      /> <ExpandMore
        className={`${styles.icon} ${styles.down} ${
            value === -1 ? styles.active : value === undefined ? '' : styles.nonVisible
        }`}
    />
        {/*{
            value === undefined ? <>
                <ExpandLess
                    className={`${styles.icon} ${styles.up} ${
                        value === 1 ? styles.active : ""
                    }`}
                /> <ExpandMore
                className={`${styles.icon} ${styles.down} ${
                    value === -1 ? styles.active : ""
                }`}
            />
            </> : value === 1 ? <ExpandLess
                className={`${styles.icon} ${styles.up} ${
                    value === 1 ? styles.active : ""
                }`}
            /> : value === -1 ? <ExpandMore
                className={`${styles.icon} ${styles.down} ${
                    value === -1 ? styles.active : ""
                }`}
            /> : ''
        }*/}

    </div>
  );
};

export default TableOrderingButton;
