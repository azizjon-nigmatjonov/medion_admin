import "./style.scss";
import menuElements from "./elements";
import brandLogo from "../../../builder_config/assets/company-logo.svg";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { useState, useEffect } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { NavLink } from "react-router-dom";
import ChildBlock from "./ChildBlock";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { mainActions } from "../../store/main/main.slice";
import { useLocation } from "react-router-dom";

const Sidebar2222 = () => {
  const sidebarIsOpen = useSelector(
    (state) => state.main.settingsSidebarIsOpen
  );
  const permissions = useSelector((state) => state.auth.permissions);
  const auth = useSelector((state) => state.auth);

  const location = useLocation();

  const pathname = "/settings/auth/matrix/profile/crossed";

  const dispatch = useDispatch();
  const [openedBlock, setOpenedBlock] = useState(null);

  const setSidebarIsOpen = (val) => {
    dispatch(mainActions.setSettingsSidebarIsOpen(val));
  };

  const switchRightSideVisible = () => {
    setSidebarIsOpen(!sidebarIsOpen);
  };

  const parentClickHandler = (element) => {
    if (element.children) {
      switchChildBlockHandler(element.id);
      if (!sidebarIsOpen) setSidebarIsOpen(true);
    } else setOpenedBlock(null);
  };

  const switchChildBlockHandler = (id) => {
    setOpenedBlock((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    if (!sidebarIsOpen) setOpenedBlock(null);
  }, [sidebarIsOpen]);

  return (
    <div className={`Sidebar ${!sidebarIsOpen ? "right-side-closed" : ""}`}>
      <div className='header'>
        <div className='brand'>
          <div className='brand-logo' onClick={switchRightSideVisible}>
            <img src={brandLogo} alt='logo' />
          </div>
          <div className='brand-name'>SETTINGS</div>
        </div>
        <div className='cloes-btn' onClick={switchRightSideVisible}>
          <MenuOpenIcon />
        </div>
      </div>

      <div className='nav-block' style={{ height: `calc(100vh - ${72}px)` }}>
        <div className='menu-element'>
          {menuElements
            ?.filter((el, idx) =>
              idx === 1 ? permissions?.[el.slug]?.["read"] !== false : true
            )
            .map((element) => {
              if (
                location.pathname === pathname &&
                auth.roleInfo?.name !== "DEFAULT ADMIN" 
                // element.id === "auth"
              ) {
                return null;
              } else {
                return (
                  <div className='parent-block' key={element.id}>
                    <NavLink
                      to={element.path}
                      exact={0}
                      className={({ isActive }) =>
                        `nav-element ${
                          isActive &&
                          (element.children ? "active-with-child" : "active")
                        }`
                      }
                      onClick={(e) => {
                        if (element.children) e.preventDefault();
                        parentClickHandler(element);
                      }}
                    >
                      <div className='icon'>
                        <element.icon />
                      </div>

                      <div className='label'>{element.title}</div>
                      {element.children && (
                        <div
                          className={`arrow-icon ${
                            openedBlock === element.id ? "open" : ""
                          }`}
                        >
                          <ExpandMoreIcon />
                        </div>
                      )}
                    </NavLink>

                    {element.children && (
                      <ChildBlock
                        element={element}
                        isVisible={openedBlock === element.id}
                      />
                    )}
                  </div>
                );
              }
            })}
        </div>
        <div className='sidebar-footer'>
          {/* <div className="parent-block">
            <NavLink
              className="nav-element"
              to="/home/profile"
              style={{ padding: "10px 0px" }}
            >
              <div className="profile-avatar">{'K'}</div>
              <div className="label">Shaxsiy ma'lumotlar</div>
            </NavLink>
          </div> */}
          {/* <div className="parent-block">
            <div className="nav-element" onClick={logoutHandler}>
              <div className="icon">
                <ExitToAppIcon />
              </div>
              <div className="label" >Logout</div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Sidebar2222;
