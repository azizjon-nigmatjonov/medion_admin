import { Logout, Settings } from "@mui/icons-material";
import { Menu } from "@mui/material";
import { useState } from "react";
import { useAliveController } from "react-activation";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authActions } from "../../store/auth/auth.slice";
import UserAvatar from "../UserAvatar";
import styles from "./style.module.scss";

const ProfilePanel = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const menuVisible = Boolean(anchorEl);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { clear } = useAliveController();

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const logoutClickHandler = () => {
    dispatch(authActions.logout());
    closeMenu();
  };

  return (
    <div>
      <UserAvatar
        user={{
          name: "User",
          photo_url: "https://image.emojisky.com/71/8041071-middle.png",
        }}
        onClick={openMenu}
      />

      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        open={menuVisible}
        onClose={closeMenu}
        classes={{ list: styles.menu, paper: styles.paper }}
      >
        <div className={styles.scrollBlocksss}>
          <div
            className={styles.menuItem}
            onClick={() => {
              navigate(`/settings/auth/matrix/profile/crossed`);
            }}
          >
            <Settings className={styles.dragIcon} />

            <p className={styles.itemText}>Profile settings</p>
          </div>

          <div className={styles.menuItem} onClick={logoutClickHandler}>
            <Logout className={styles.dragIcon} />

            <p className={styles.itemText}>Logout</p>
          </div>
        </div>
      </Menu>
    </div>
  );
};

export default ProfilePanel;
