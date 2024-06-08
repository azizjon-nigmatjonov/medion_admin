import React, { useState } from "react";
import styles from "../style.module.scss";
import ClearIcon from "@mui/icons-material/Clear";
import { obj } from "./data.js";
import { Switch } from "@mui/material";
import DentistView from "./DentistView";
import DentistChildren from "./DentistChildren";

function DentistComponent({ onClose, type, setType }) {
  const handleChange = () => {
    setType(!type)
  }
  
  return (
    <>
      <div className={styles.dentist}>
        <div className={styles.dentistHeader}>
          <h2 className={styles.dentistTitle}>Выберите зуб</h2>
          <button className={styles.clearBtn} onClick={onClose}>
            <ClearIcon />
          </button>
        </div>

        {!type ? (
          <div className={styles.dentistContent}>
            {obj?.filter((el) => !el?.type)?.map((item) => (
              <DentistView item={item} type={type}/>
            ))}
          </div>
          ) : (
          <div className={styles.dentistContentChild}>
            {obj?.filter((el) => el?.type === 'child').map((item) => (
                <DentistChildren item={item}/>
              ))}
          </div>
        )}
        <div className={styles.switchBtn}>
          <span>Взрослый</span>  
          <Switch
            checked={type}
            onChange={handleChange}
            inputProps={{ 'aria-label': 'controlled' }}
            />
     <span>Детский</span>
        </div>
        <div className={styles.controlBtns}>
          <button className={styles.cancelBtn}>Отменить</button>
          <button className={styles.updateBtn}>Сохранить</button>
        </div>
      </div>
    </>
  );
}

export default DentistComponent;
