import React from "react";
import { numberWithSpaces } from "../../utils/formatNumbers";
import styles from "./style.module.scss";
import { SearchIcon } from "../../../src/assets/icons/icon.jsx";
import DescriptionIcon from "@mui/icons-material/Description";
import FolderIcon from "@mui/icons-material/Folder";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import useDebounce from "../../hooks/useDebounce";

function CascadingMany2One({
  backArrowButton,
  level,
  title,
  searchText,
  setSearchText,
  field,
  fields,
  foundServices,
  currentLevel,
  handleClick,
  setDebouncedValue,
  searchServices,
  debouncedValue,
  handleServices,
}) {
  const inputChangeHandler = useDebounce((val) => setDebouncedValue(val), 300);
  return (
    <div className={styles.cascading_item}>
      {level !== 1 && (
        <div className={styles.cascading_head}>
          <div className={styles.cascading_head_item}>
            {level !== 1 && (
              <button className={styles.back_icon} onClick={backArrowButton}>
                <ArrowBackIcon />
              </button>
            )}
          </div>
        </div>
      )}
      {level === 1 && (
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
      {level === fields?.attributes?.cascadings?.length && (
        <div className={styles.cascading_search}>
          <button className={styles.search_icon}>
            <SearchIcon />
          </button>
          <input
            type="search"
            onChange={(e) => inputChangeHandler(e.target.value)} //setSearchText
            placeholder="Поиск"
            className={styles.cascading_search_input}
          />
        </div>
      )}
      <div className={styles.search_items}>
        {debouncedValue
          ? searchServices?.map((item) => (
              <div
                className={styles.cascading_items}
                onClick={() => handleServices(item)}
              >
                <span>
                  <DescriptionIcon style={{ color: "#6E8BB7" }} />
                </span>
                <p>{`${item?.name} ${
                  item?.first_price ? numberWithSpaces(item?.first_price) : ""
                }`}</p>
              </div>
            ))
          : searchText
          ? foundServices?.map((item) => (
              <div
                className={styles.cascading_items}
                onClick={() => handleClick(item)}
              >
                <span>
                  {currentLevel < fields?.attributes?.cascadings?.length ? (
                    <FolderIcon style={{ color: "#6E8BB7" }} />
                  ) : (
                    <DescriptionIcon style={{ color: "#6E8BB7" }} />
                  )}
                </span>
                <p>{`${item?.name} ${
                  item?.first_price ? numberWithSpaces(item?.first_price) : ""
                }`}</p>
              </div>
            ))
          : field?.map((item) => (
              <div
                className={styles.cascading_items}
                onClick={() => handleClick(item)}
              >
                <span>
                  {currentLevel < fields?.attributes?.cascadings?.length ? (
                    <FolderIcon style={{ color: "#6E8BB7" }} />
                  ) : (
                    <DescriptionIcon style={{ color: "#6E8BB7" }} />
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
    </div>
  );
}

export default CascadingMany2One;
