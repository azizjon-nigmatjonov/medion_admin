import {
  AccountTree,
  CalendarMonth,
  Description,
  Settings,
  TableChart,
} from "@mui/icons-material";
import { Modal, Popover } from "@mui/material";
import { useState } from "react";
import { useQueryClient } from "react-query";
import IconGenerator from "../../../../components/IconPicker/IconGenerator";
import ViewSettings from "../ViewSettings";
import style from "./style.module.scss";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ButtonsPopover from "../../../../components/ButtonsPopover";
import constructorViewService from "../../../../services/constructorViewService";
import { Navigate, useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { viewTypes } from "../../../../utils/constants/viewTypes";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

const ViewTabSelector = ({
  selectedTabIndex,
  setSelectedTabIndex,
  views = [],
}) => {
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [newViewTypes, setNewViewTypes] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const computedViewTypes = viewTypes?.map((el) => ({ value: el, label: el }));
  const [selectedView, setSelectedView] = useState(null);
  const [typeNewView, setTypeNewView] = useState(null);
  const handleClick = (event) => {
    setSelectedView("NEW");
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const openModal = (data) => {
    setIsChanged(false);
    setSettingsModalVisible(true);
    setSelectedView(data);
  };
  const closeModal = () => {
    setSettingsModalVisible(false);
    if (isChanged) queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
  };

  const deleteView = (id) => {
    constructorViewService.delete(id).then(() => {
      navigate("/reload", {
        state: {
          redirectUrl: window.location.pathname,
        },
      });
    });
  };

  return (
    <>
      <div className={style.selector} style={{ minWidth: "fit-content" }}>
        {views.map((view, index) => (
          <div
            onClick={() => setSelectedTabIndex(index)}
            key={view.id}
            className={`${style.element} ${
              selectedTabIndex === index ? style.active : ""
            }`}
          >
            {view.type === "TABLE" && <TableChart className={style.icon} />}
            {view.type === "CALENDAR" && (
              <CalendarMonth className={style.icon} />
            )}
            {view.type === "CALENDAR HOUR" && (
              <IconGenerator className={style.icon} icon="chart-gantt.svg" />
            )}
            {view.type === "GANTT" && (
              <IconGenerator className={style.icon} icon="chart-gantt.svg" />
            )}
            {view.type === "TREE" && <AccountTree className={style.icon} />}
            {view.type === "BOARD" && (
              <IconGenerator className={style.icon} icon="brand_trello.svg" />
            )}
            {view.type === "FINANCE CALENDAR" && (
              <MonetizationOnIcon className={style.icon} />
            )}
            <span>{view.name ? view.name : view.type}</span>

            {selectedTabIndex === index && (
              <ButtonsPopover
                className={""}
                onEditClick={() => openModal(view)}
                onDeleteClick={() => deleteView(view.id)}
              />
            )}
          </div>
        ))}

        {/* <div className={style.element} onClick={openModal}>
          <Settings className={style.icon} />
        </div> */}

        <div
          className={style.element}
          aria-describedby={id}
          variant="contained"
          onClick={handleClick}
        >
          <AddIcon className={style.icon} />
          View
        </div>

        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <div className={style.viewTypes}>
            {computedViewTypes.map((type, index) => (
              <button
                onClick={() => {
                  handleClose();
                  openModal();
                  setSelectedView("NEW");
                  setTypeNewView(type.value);
                }}
              >
                {type.value === "TABLE" && (
                  <TableChart className={style.icon} />
                )}
                {type.value === "CALENDAR" && (
                  <CalendarMonth className={style.icon} />
                )}
                {type.value === "CALENDAR HOUR" && (
                  <IconGenerator
                    className={style.icon}
                    icon="chart-gantt.svg"
                  />
                )}
                {type.value === "GANTT" && (
                  <IconGenerator
                    className={style.icon}
                    icon="chart-gantt.svg"
                  />
                )}
                {type.value === "TREE" && (
                  <AccountTree className={style.icon} />
                )}
                {type.value === "BOARD" && (
                  <IconGenerator
                    className={style.icon}
                    icon="brand_trello.svg"
                  />
                )}
                {type.value === "FINANCE CALENDAR" && (
                  <MonetizationOnIcon className={style.icon} />
                )}
                {type.label}
              </button>
            ))}
          </div>
        </Popover>
      </div>

      <Modal
        className={style.modal}
        open={settingsModalVisible}
        onClose={closeModal}
      >
        <ViewSettings
          closeModal={closeModal}
          setIsChanged={setIsChanged}
          viewData={selectedView}
          typeNewView={typeNewView}
        />
      </Modal>
    </>
  );
};

export default ViewTabSelector;
