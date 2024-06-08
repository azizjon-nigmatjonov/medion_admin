import React from "react";
import styles from "./style.module.scss";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { SearchIcon } from "../../../../src/assets/icons/icon.jsx";
import { Button, Checkbox, FormControlLabel, IconButton } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import FolderIcon from "@mui/icons-material/Folder";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { numberWithSpaces } from "../../../utils/formatNumbers";
import useDebounce from "../../../hooks/useDebounce";
import { Close } from "@mui/icons-material";

function CascadingMany2Many({
  currentLevel,
  level,
  onChecked,
  confirmButton,
  title,
  backArrowButton,
  setSearchText,
  searchText,
  foundServices,
  handleClick,
  field,
  fields,
  setDebouncedValue,
  debouncedValue,
  searchServices,
  handleServices,
  handleClose,
  ids,
}) {
  const inputChangeHandler = useDebounce((val) => {
    setDebouncedValue(val);
  }, 300);

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
            <span>{level === 1 ? "Всe" : title?.[title?.length - 1]}</span>
          </div>
        </div>
        <Button
          variant="outlined"
          className={styles.confirm_button}
          size="small"
          onClick={confirmButton}
        >
          Save
        </Button>
        <IconButton className={styles.closeButton} onClick={handleClose}>
          <Close className={styles.closeIcon} />
        </IconButton>
      </div>
      {level === 1 && (
        <div className={styles.cascading_search}>
          <button className={styles.search_icon}>
            <SearchIcon />
          </button>
          <input
            type="search"
            onChange={(e) => {
              inputChangeHandler(e.target.value);
            }}
            placeholder="Поиск"
            className={styles.cascading_search_input}
          />
        </div>
      )}
      {level === 4 && (
        <div className={styles.cascading_search}>
          <button className={styles.search_icon}>
            <SearchIcon />
          </button>
          <input
            type="search"
            onChange={(e) => {
              inputChangeHandler(e.target.value);
            }}
            placeholder="Поиск"
            className={styles.cascading_search_input}
          />
        </div>
      )}
      {/* {level === fields?.attributes?.cascadings?.length && (
        <div className={styles.cascading_search}>
          <button className={styles.search_icon}>
            <SearchIcon />
          </button>
          <input
            type='search'
            onChange={(e) => setSearchText(e.target.value)}
            placeholder='Поиск'
            className={styles.cascading_search_input}
          />
        </div>
      )} */}

      <div className={styles.search_items}>
        {debouncedValue
          ? searchServices?.map((item) => (
              <div
                className={styles.cascading_items}
                onClick={() => handleServices(item)}
              >
                <span className={styles.input_checkbox}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={item?.guid}
                        onChange={(e) => onChecked(item?.guid)}
                        onClick={(e) => e.stopPropagation()}
                        checked={ids.includes(item?.guid)}
                      />
                    }
                    label={
                      <div className={styles.input_checkbox__items}>
                        <DescriptionIcon style={{ color: "#6E8BB7" }} />
                        <p>{`${item?.name} ${
                          item?.first_price
                            ? numberWithSpaces(item?.first_price)
                            : ""
                        }`}</p>
                      </div>
                    }
                  />
                </span>
              </div>
            ))
          : searchText
          ? foundServices?.map((item) => (
              <div
                className={styles.cascading_items}
                onClick={() => {
                  handleClick(item);
                }}
              >
                <span className={styles.input_checkbox}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={item?.guid}
                        onChange={(e) => onChecked(item?.guid)}
                        onClick={(e) => e.stopPropagation()}
                        checked={ids.includes(item?.guid)}
                      />
                    }
                    label={
                      <div className={styles.input_checkbox__items}>
                        <DescriptionIcon style={{ color: "#6E8BB7" }} />
                        <p>{`${item?.name} ${
                          item?.first_price
                            ? numberWithSpaces(item?.first_price)
                            : ""
                        }`}</p>
                      </div>
                    }
                  />
                </span>
              </div>
            ))
          : field?.map((item) => (
              <div
                className={styles.cascading_items}
                onClick={() => handleClick(item)}
              >
                <span>
                  {currentLevel < fields?.attributes?.cascadings?.length ? (
                    <div className={styles.cascading_items__child}>
                      <FolderIcon style={{ color: "#6E8BB7" }} />
                      <p>
                        {`${item?.name} ${
                          item?.first_price
                            ? numberWithSpaces(item?.first_price)
                            : ""
                        }`}
                        <span>
                          {currentLevel !==
                            fields?.attributes?.cascadings?.length && (
                            <ChevronRightIcon />
                          )}
                        </span>
                      </p>
                    </div>
                  ) : (
                    <span className={styles.input_checkbox}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value={item?.guid}
                            onChange={(e) => onChecked(item?.guid)}
                            onClick={(e) => e.stopPropagation()}
                            checked={ids.includes(item?.guid)}
                          />
                        }
                        label={
                          <div className={styles.input_checkbox__items}>
                            <DescriptionIcon style={{ color: "#6E8BB7" }} />
                            <p>
                              {`${item?.name} ${
                                item?.first_price
                                  ? numberWithSpaces(item?.first_price)
                                  : ""
                              }`}
                              <span>
                                {currentLevel !==
                                  fields?.attributes?.cascadings?.length && (
                                  <ChevronRightIcon />
                                )}
                              </span>
                            </p>
                          </div>
                        }
                      />
                    </span>
                  )}
                </span>
              </div>
            ))}
      </div>
    </div>
  );
}

export default CascadingMany2Many;
