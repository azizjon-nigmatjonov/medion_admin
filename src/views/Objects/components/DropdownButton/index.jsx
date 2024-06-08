import { ArrowDropDown, ArrowDropUp, PictureAsPdf } from "@mui/icons-material";
import { CircularProgress, Menu } from "@mui/material";
import { useState } from "react";
import styles from "./style.module.scss";

const DropdownButton = ({ loader, children, onClick, text = "Save", icon }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const hasChildren = Array.isArray(children) ? !!children?.length : !!children;

  return (
    <>
      <div className={styles.buttonWrapper}>
        <div className={styles.button} onClick={onClick}>
          {icon}
          {text}

          {!hasChildren && loader && (
            <CircularProgress size={15} color="secondary" />
          )}
        </div>

        {hasChildren && (
          <div className={styles.iconBlock} onClick={openMenu}>
            {loader ? (
              <CircularProgress size={14} color="secondary" />
            ) : !anchorEl ? (
              <ArrowDropUp />
            ) : (
              <ArrowDropDown />
            )}
          </div>
        )}
      </div>

      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl && hasChildren}
        onClose={closeMenu}
        classes={{ list: styles.menu, paper: styles.paper }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
      >
        <div className={styles.scrollBlocksss} onClick={closeMenu}>
          {children}
        </div>
      </Menu>
    </>
  );
};

export default DropdownButton;
