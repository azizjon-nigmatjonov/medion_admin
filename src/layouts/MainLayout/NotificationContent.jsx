import React, { useMemo, useState } from "react";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import style from "./style.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import notificationService from "../../services/notificationService.js";
import { useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { fetchConstructorTableListAction } from "../../store/constructorTable/constructorTable.thunk";

function NotificationContent({ notifications, handleCloseNotify }) {
  const { tableSlug, appId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isUserId = useSelector((state) => state?.auth?.userId);
  const [tabs, setTabs] = useState(1);
  const queryClient = useQueryClient();

  //============NEW NOTIFICATION==========
  const computedNotificationsNew = useMemo(() => {
    const computedValue = notifications?.newData?.map((el) => ({
      label: el?.name,
      id: el?.id,
      tableSlug: el?.table_slug,
      userId: el?.user_id,
      objectId: el.object_id
    }));
    return computedValue;
  }, [notifications]);

  //============OLD NOTIFICATION==========
  const computedNotificationsOld = useMemo(() => {
    const computedValue = notifications?.oldData?.map((el) => ({
      label: el?.name,
      id: el?.id,
      tableSlug: el?.table_slug,
      userId: el?.user_id,
      objectId: el?.object_id
    }));
    return computedValue;
  }, [notifications]);

  const navigateUpdate = (item) => {
    notificationService
      .update({
        id: item?.id,
        read: true,
      })
      .then(() => {
        queryClient.refetchQueries("GET_NOTIFICATION_LIST", tableSlug, {
          table_slug: tableSlug,
          user_id: isUserId,
        });
        dispatch(fetchConstructorTableListAction(appId));
        if (tableSlug) {
          navigate(
            `/main/b30c2225-de53-448a-938c-0c6924faebde/object/${tableSlug}/${item?.objectId}`
          );
        }
      });

    handleCloseNotify();
  };
  const navigateToEditPage = (item) => {
    if (tableSlug) {
      navigate(
        `/main/b30c2225-de53-448a-938c-0c6924faebde/object/${tableSlug}/${item?.objectId}`
      );
    }

    handleCloseNotify();
  };

  return (
    <div className={style.notifyMenu}>
      <h2>Notifications</h2>

      <div className={style.notifyMenuContent}>
        <div className={style.notifyTabs}>
          <div
            className={`${
              tabs === 1 ? style.notifyTabsLinksActive : style.notifyTabsLinks
            }`}
            onClick={() => setTabs(1)}
          >
            {notifications?.newData?.length > 0 && (
              <span className={style.notificationNum}>
                {notifications?.newData.length}
              </span>
            )}
            New
          </div>
          <div
            className={`${
              tabs === 2 ? style.notifyTabsLinksActive : style.notifyTabsLinks
            }`}
            onClick={() => setTabs(2)}
          >
            Old
          </div>
        </div>

        <div className={style.notifyPanels}>
          {tabs === 1 && (
            <div className={style.notifyPanelContent}>
              {" "}
              {notifications?.newData?.length ? (
                computedNotificationsNew.map((item, index) => (
                  <div
                    className={style.notifyMenuItem}
                    onClick={() => navigateUpdate(item)}
                  >
                    <span className={style.notifyMenuIndex}>{`${
                      index + 1
                    }.   `}</span>{" "}
                    {item?.label}
                  </div>
                ))
              ) : (
                <div className={style.notifyMenuItemEmpty}>
                  No notifications are found!{" "}
                  <span>
                    <NotificationsOffIcon />
                  </span>
                </div>
              )}
            </div>
          )}
          {tabs === 2 && (
            <div className={style.notifyPanelContent}>
              {" "}
              {notifications?.oldData?.length ? (
                computedNotificationsOld.map((item, index) => (
                  <div
                    className={style.notifyMenuItem}
                    onClick={() => navigateToEditPage(item)}
                  >
                    <span className={style.notifyMenuIndex}>{`${
                      index + 1
                    }.   `}</span>{" "}
                    {item?.label}
                  </div>
                ))
              ) : (
                <div className={style.notifyMenuItemEmpty}>
                  No notifications are found!{" "}
                  <span>
                    <NotificationsOffIcon />
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationContent;
