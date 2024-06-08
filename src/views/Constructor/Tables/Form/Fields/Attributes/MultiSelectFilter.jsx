import { ArrowDropDown, Close } from "@mui/icons-material";
import { Checkbox, Divider, IconButton, Menu } from "@mui/material";
import React, { useMemo, useState } from "react";
import SearchInput from "../../../../../../components/SearchInput";
import useDebounce from "../../../../../../hooks/useDebounce";
import styles from "./style.module.scss";

function MultiSelectFilter({ control, options, name }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const menuVisible = Boolean(anchorEl);

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const inputChangeHandler = useDebounce((val) => {
    // setSearchText(val);
  }, 300);

  const closeMenu = () => {
    setAnchorEl(null);
    // setSearchText("");
  };

  const rowClickHandler = (option) => {
    // if (value?.includes(option.value)) {
    //   onChange(value.filter((item) => item !== option.value));
    // } else {
    //   onChange([...value, option.value]);
    // }
  };

  const onClearButtonClick = (e) => {
    e.stopPropagation();
    // onChange(null);
  };

  return (
    <div className={styles.autocomplete}>
      <div className={styles.autocompleteButton} onClick={openMenu}>
        <div className={styles.autocompleteValue}>
          {/* {computedValue?.[0]?.label || ( */}
          <span
            className={styles.placeholder}
            // style={{ color: !value?.length ? "#909EAB" : "#000" }}
          >
            {/* {!value?.length ? label : value[0]} */}
          </span>
          {/* )} */}
        </div>
        {/* {computedValue?.length > 1 && `+${computedValue.length - 1}`}
        {!!computedValue?.length && ( */}
        <IconButton onClick={""}>
          <Close />
        </IconButton>
        {/* )} */}
        <ArrowDropDown />
      </div>

      <Menu
        anchorEl={anchorEl}
        open={menuVisible}
        // TransitionComponent={Fade}
        onClose={closeMenu}
        classes={{ list: styles.menu, paper: styles.paper }}
      >
        <SearchInput fullWidth onChange={""} placeholder={"label"} />

        <div className={styles.scrollBlock}>
          {/*{computedValue?.map((option) => (*/}
          {/*  <div*/}
          {/*    onClick={() => rowClickHandler(option)}*/}
          {/*    key={option.value}*/}
          {/*    className={styles.option}*/}
          {/*  >*/}
          {/*    <Checkbox checked/>*/}
          {/*    <p className={styles.label}>{option.label}</p>*/}
          {/*  </div>*/}
          {/*))}*/}

          <Divider />

          {options?.map((option) => (
            <div
              onClick={() => rowClickHandler(option)}
              key={option.value}
              className={styles.option}
            >
              {/* {computedValue
                .map((item) => item.value)
                .includes(option.value) ? (
                <Checkbox checked />
              ) : (
                <Checkbox />
              )} */}

              <p className={styles.label}>{option.label}</p>
            </div>
          ))}
        </div>
      </Menu>
    </div>
  );
}

export default MultiSelectFilter;
