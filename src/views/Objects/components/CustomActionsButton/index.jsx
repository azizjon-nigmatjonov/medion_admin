import { KeyboardArrowDown, WindowSharp } from "@mui/icons-material";
import { CircularProgress, Menu, Tooltip } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import SecondaryButton from "../../../../components/Buttons/SecondaryButton";
import IconGenerator from "../../../../components/IconPicker/IconGenerator";
import useCustomActionsQuery from "../../../../queries/hooks/useCustomActionsQuery";
import { showAlert } from "../../../../store/alert/alert.thunk";
import request from "../../../../utils/request";
import styles from "./style.module.scss";

const CustomActionsButton = ({
  selectedObjects,
  setSelectedObjects = () => {},
  tableSlug,
}) => {
  const [loader, setLoader] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const { data: { custom_events: customEvents = [] } = {} } =
    useCustomActionsQuery({
      tableSlug,
    });

  const onEventSelect = (event) => {
    const data = {
      function_id: event.event_path,
      object_ids: selectedObjects,
    };

    setLoader(true);
    closeMenu();

    request
      .post("/invoke_function", data)
      .then((res) => {
        dispatch(showAlert("Success", "success"));
        setSelectedObjects([]);

        let url = event?.url ?? "";

        if (res?.data?.status === "error") {
          dispatch(showAlert(/*res?.data?.message,*/ "error"));
        } else {
          if (url) {
            Object.entries(res?.data ?? {}).forEach(([key, value]) => {
              const computedKey = "${" + key + "}";
              url = url.replaceAll(computedKey, value);
            });
          }
          if (url.includes("reload:")) {
            navigate("/reload", {
              state: {
                redirectUrl: url,
              },
            });
          } else if (url === "" || url === "reload") {
            navigate("/reload", {
              state: {
                redirectUrl: window.location.pathname
              },
            });
          } else if (url === "reloadRelations") {
            navigate("/reloadRelations", {
              state: {
                redirectUrl: window.location.pathname
              },
            });
          } else if (url === "schedule") {
            navigate(url);
          } else {
            navigate(url);
          }
        }
      })
      .finally(() => setLoader(false));
  };

  if (!selectedObjects?.length) return null;
  return (
    <>
      <Tooltip title="Custom functions">
        <SecondaryButton onClick={openMenu} style={{ paddingRight: 8 }}>
          {loader && <CircularProgress size={16} />} Действия{" "}
          <KeyboardArrowDown />
        </SecondaryButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={closeMenu}
        classes={{ list: styles.menu, paper: styles.paper }}
      >
        <div className={styles.scrollBlocksss}>
          {customEvents.map((event, index) =>
            event?.action_permission &&
            event?.action_permission?.permission === true ? (
              <div
                key={event.id}
                className={`${styles.menuItem}`}
                onClick={() => onEventSelect(event)}
              >
                <IconGenerator icon={event.icon} />
                <p className={styles.itemText}>{event.label}</p>
              </div>
            ) : (
              ""
            )
          )}
        </div>
      </Menu>
    </>
  );
};

export default CustomActionsButton;
