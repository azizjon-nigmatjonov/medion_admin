import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import constructorRelationService from "../../../../services/constructorRelationService";
import { CircularProgress, IconButton } from "@mui/material";
import styles from "./style.module.scss";
import { ArrowBack, Close } from "@mui/icons-material";
import SearchInput from "../../../../components/SearchInput";
import IconGenerator from "../../../../components/IconPicker/IconGenerator";

function Dropdown({
  closeMenu,
  selectedTable,
  setSelectedTable,
  relations,
  loader,
}) {
  return (
    <div className={styles.menu}>
      <div className={styles.menuHeader}>
        {selectedTable ? (
          <IconButton color="primary" onClick={() => setSelectedTable(null)}>
            <ArrowBack />
          </IconButton>
        ) : (
          <div></div>
        )}

        {selectedTable?.label}

        <IconButton onClick={closeMenu}>
          <Close />
        </IconButton>
      </div>

      <div className={styles.menuBody}>
        {selectedTable && (
          <div className={styles.menuRow}>
            <SearchInput size="small" fullWidth />
            {/* onChange={inputChangeHandler}  */}
          </div>
        )}

        {!selectedTable ? (
          <>
            {relations.map((table) => (
              <div
                key={table.id}
                className={styles.menuRow}
                onClick={() => setSelectedTable(table)}
              >
                <IconGenerator icon={table.icon} />
                {table.title ? table.title : table.slug}
              </div>
            ))}
          </>
        ) : (
          <>
            {loader ? (
              <div className="flex align-center justify-center p-2 ">
                <CircularProgress />
              </div>
            ) : (
              <div className={styles.menu_body}>
                {relations?.map((object) => (
                  <div
                    key={object.id}
                    className={styles.menuRow}
                    // onClick={() => onObjectSelect(object, selectedTable)}
                  >
                    {object.title ? object.title : object.slug}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* <div className={styles.menuRow}>
            <IconGenerator icon="user-doctor.svg" />
            Patients
          </div> */}
      </div>
    </div>
  );
}

export default Dropdown;
