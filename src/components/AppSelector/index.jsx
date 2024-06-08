import { Menu } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import RectangleIconButton from "../Buttons/RectangleIconButton";
import IconGenerator from "../IconPicker/IconGenerator";
import styles from "./style.module.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { tabRouterActions } from "../../store/tabRouter/tabRouter.slice";
import { useAliveController } from "react-activation";
import { Link } from "react-router-dom";

const AppSelector = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const menuVisible = Boolean(anchorEl);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { clear } = useAliveController();
  const permissions = useSelector((state) => state.auth.permissions);
  const permissionForSettings = permissions?.["settings"]?.["read"];

  let apps = [
    {
      id: "analytics",
      name: "Аналитика",
      icon: "chart-line.svg",
      type: "static",
    },
    {
      id: "settings",
      name: "Настройки",
      icon: "gear.svg",
      type: "static",
    },
  ];

  const staticApps = useMemo(() => {
    return apps.filter((app) => {
      if (app.id === "settings" && !permissionForSettings) return false;
      return true;
    });
  }, [permissionForSettings]);

  const applications = useSelector((state) => state.application.list);

  const computedList = useMemo(() => {
    return [...applications, ...staticApps];
  }, [applications]);

  const activeApp = useMemo(() => {
    if (pathname.includes("/main")) {
      return pathname.split("/")[2];
    }

    return pathname.split("/")[1];
  }, [pathname]);

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const rowClickHandler = (table) => {
    if (table.type === "static") navigate(`/${table.id}`);
    else navigate(`/main/${table.id}`);
    // else window.open(`/main/${table.id}`, "_blank");

    dispatch(tabRouterActions.clear());
    clear();
    closeMenu();
  };

  // const linkFunc = (table) => {
  //   if (table.type === "static") return `/${table.id}`;
  //   else return `/main/${table.id}`;
  // };
  //constructor/apps //auth/users
  return (
    <div>
      <RectangleIconButton
        onClick={openMenu}
        color='primary'
        className={`${styles.addButton}`}
      >
        <DashboardIcon />
      </RectangleIconButton>

      <Menu
        id='lock-menu'
        anchorEl={anchorEl}
        open={menuVisible}
        onClose={closeMenu}
        classes={{ list: styles.menu, paper: styles.paper }}
      >
        <div className={styles.scrollBlocksss}>
          {computedList.map((app, index) => (
            <Link to={app.type === "static" ? `/${app.id}` : `/main/${app.id}`}>
              <div
                key={app.id}
                className={`${styles.menuItem} ${
                  app.id === activeApp ? styles.active : ""
                }`}
                onClick={() => rowClickHandler(app)}
                activeClassName={styles.active}
              >
                <IconGenerator
                  icon={app.icon}
                  className={`${styles.dragIcon}  ${
                    app.id === activeApp ? styles.active : ""
                  } drag-handle`}
                />
                <p
                  className={`${styles.itemText}  ${
                    app.id === activeApp ? styles.active : ""
                  }`}
                >
                  {app.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Menu>
    </div>
  );
};

export default AppSelector;
