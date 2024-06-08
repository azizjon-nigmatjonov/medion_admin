import { Close } from "@mui/icons-material";
import { Backdrop, Box, Fade, Modal } from "@mui/material";
import { useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

import styles from "./styles.module.scss";
import EventsTab from "./Tabs/EventsTab";
import SettingsTab from "./Tabs/SettingsTab";

const ActionForm = ({
  isOpen,
  handleClose,
  eventLabel,
  modalItemId,
  eventsRefetch,
}) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    bgcolor: "#fff",
    boxShadow: 24,
    borderRadius: "6px",
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={isOpen}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={isOpen}>
        <Box sx={style}>
          <Tabs
            direction={"ltr"}
            selectedIndex={selectedTab}
            onSelect={setSelectedTab}
          >
            <div className={styles.modal_header}>
              <div>
                <p
                  style={{ fontWeight: 700, fontSize: 14, lineHeight: "24px" }}
                >
                  Automations
                </p>
                <TabList>
                  <Tab>Настройки</Tab>
                  <Tab>Событие</Tab>
                </TabList>
              </div>
              <span onClick={handleClose}>
                <Close htmlColor="#6E8BB7" />
              </span>
            </div>

            <TabPanel>
              <SettingsTab
                eventsRefetch={eventsRefetch}
                modalItemId={modalItemId}
                eventLabel={eventLabel}
                handleClose={handleClose}
              />
            </TabPanel>
            <TabPanel>
              <EventsTab />
            </TabPanel>
          </Tabs>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ActionForm;
