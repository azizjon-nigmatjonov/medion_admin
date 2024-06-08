import React from "react";
import { numberWithSpaces } from "../../utils/formatNumbers";
import styles from "./style.module.scss";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { SearchIcon } from "../../../src/assets/icons/icon.jsx";
import DescriptionIcon from "@mui/icons-material/Description";
import FolderIcon from "@mui/icons-material/Folder";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Checkbox } from "@mui/material";

function CascadingMany2Many({
  backArrowButton,
  level,
  fields,
  title,
  searchText,
  currentLevel,
  handleClick,
  foundServices,
  setSearchText,
  field,
  confirmButton,
  onChecked,

  setDebouncedValue,
  setState,
  debouncedValue,
  searchServices,
  handleServices,
}) {
  let debounce = setTimeout(() => {}, 0);

  const inputChangeHandler = (e) => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      setDebouncedValue(e.target.value);
    }, 300);
  };

  return (
    <div className={styles.cascading_item}>
      <div className={styles.cascading_head}>
        <div className={styles.cascading_head_item}>
          {level !== 1 && (
            <button className={styles.back_icon} onClick={backArrowButton}>
              <ArrowBackIcon />
            </button>
          )}
          <div className={styles.head_title}>
            <span>{level === 1 ? "Вс" : title?.[title?.length - 1]}</span>
          </div>
        </div>
      </div>
      {level === 4 && (
        <div className={styles.cascading_search}>
          <button className={styles.search_icon}>
            <SearchIcon />
          </button>
          <input
            type="search"
            onChange={(e) => inputChangeHandler(e.target.value)}
            placeholder="Поиск"
            className={styles.cascading_search_input}
          />
        </div>
      )}
      <div className={styles.search_items}>
        {searchText
          ? foundServices?.map((item) => (
              <div
                className={styles.cascading_items}
                onClick={() => {
                  handleClick(item);
                }}
              >
                <span className={styles.input_checkbox}>
                  <Checkbox
                    value={item?.guid}
                    onChange={(e) => onChecked(item?.guid)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <DescriptionIcon style={{ color: "#6E8BB7" }} />
                </span>
                <p>{`${item?.name} ${
                  item?.first_price ? numberWithSpaces(item?.first_price) : ""
                }`}</p>
              </div>
            ))
          : field?.map((item) => (
              <div className={styles.cascading_items}>
                <span>
                  {currentLevel < fields?.attributes?.cascadings?.length ? (
                    <FolderIcon style={{ color: "#6E8BB7" }} />
                  ) : (
                    <span className={styles.input_checkbox}>
                      <Checkbox
                        value={item?.guid}
                        onChange={(e) => onChecked(item?.guid)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <DescriptionIcon style={{ color: "#6E8BB7" }} />
                    </span>
                  )}
                </span>
                <p>
                  {`${item?.name} ${
                    item?.first_price ? numberWithSpaces(item?.first_price) : ""
                  }`}
                  <span>
                    {currentLevel !==
                      fields?.attributes?.cascadings?.length && (
                      <ChevronRightIcon />
                    )}
                  </span>
                </p>
              </div>
            ))}
      </div>
      <button className={styles.confirm_button} onClick={confirmButton}>
        Ok
      </button>
    </div>
  );
}

export default CascadingMany2Many;
