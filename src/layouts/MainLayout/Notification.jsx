import React, { useState } from "react";
import RectangleIconButton from "../../components/Buttons/RectangleIconButton";
import styles from "./style.module.scss";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { Menu } from "@mui/material";
import NotificationContent from "./NotificationContent";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import notificationService from "../../services/notificationService.js";

function Notifications({}) {
  const isUserId = useSelector((state) => state?.auth?.userId);
  const { tableSlug } = useParams();
  const [notify, setNotify] = useState(null);
  const openNotify = Boolean(notify);

  //==========GET NOTIFICATIONS==========
  const { data: notifications } = useQuery(
    ["GET_NOTIFICATION_LIST", tableSlug],
    () => {
      return notificationService.getList({
        table_slug: tableSlug,
        user_id: isUserId,
      });
    },
    {
      select: (res) => {
        const newData = res?.notifications?.filter((item) => {
          return !item?.read;
        });
        const oldData = res?.notifications?.filter((item) => {
          return item?.read === true;
        });
        return {
          newData,
          oldData,
        };
      },
    }
  );

  //============NOTIFICATIONS MENU=========
  const handleOpenNotify = (event) => {
    setNotify(event.currentTarget);
  };
  const handleCloseNotify = () => {
    setNotify(null);
  };

  return (
    <>
      <div className={styles.noficationButton}>
        {notifications?.newData?.length > 0 && (
          <span className={styles.notificationNum}>
            {notifications?.newData?.length ?? 0}
          </span>
        )}

        <RectangleIconButton
          color="success"
          className=""
          size="small"
          onClick={handleOpenNotify}
        >
          <NotificationsActiveIcon color="primary" />
        </RectangleIconButton>
      </div>
      <Menu
        anchorEl={notify}
        open={openNotify}
        onClose={handleCloseNotify}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
      >
        <NotificationContent
          handleCloseNotify={handleCloseNotify}
          notifications={notifications}
        />
      </Menu>
    </>
  );
}

export default Notifications;
