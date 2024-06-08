import { useCallback, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Clear } from "@mui/icons-material";
import { Modal } from "@mui/material";

import constructorFieldService from "../../services/constructorFieldService";
import PermissionYesOrNoPopup from "./PermissionYesOrNoPopup";
import DataTable from "../../components/DataTable";
import { CrossPerson, TwoUserIcon } from "../../assets/icons/icon";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import constructorObjectService from "../../services/constructorObjectService";
import actionPermissionService from "../../services/actionPermissionService";
import styles from "./styles.module.scss";

const ActionPermissionModal = ({ isOpen, handleClose, table_slug }) => {
  const { roleId } = useParams();

  const [anchorViewEl, setAnchorViewEl] = useState(null);
  const [anchorEditEl, setAnchorEditEl] = useState(null);
  const [popupId, setPopupId] = useState("");
  const [finalData, setFinalData] = useState([]);

  const handleOpenViewPopup = (event) => {
    setAnchorViewEl(event.currentTarget);
  };
  const handleCloseViewPopup = () => {
    setAnchorViewEl(null);
  };

  const columns = [
    {
      id: 1,
      label: "Action name",
      slug: "label",
      type: "SINGLE_LINE",
    },
    {
      id: 2,
      label: "Action permission",
      slug: "permission",
      type: "SINGLE_LINE",
      render: (val, row) => (
        <div
          onClick={(e) => {
            anchorViewEl ? handleCloseViewPopup() : handleOpenViewPopup(e);
            setPopupId(row.custom_event_id);
          }}
        >
          <div style={{ textAlign: "center" }}>
            {finalData.find((i) => i.id === row.custom_event_id)?.["view"] ? (
              finalData.find((i) => i.id === row.custom_event_id)?.["view"] ===
              "Yes" ? (
                <TwoUserIcon />
              ) : (
                <CrossPerson />
              )
            ) : val ? (
              <TwoUserIcon />
            ) : (
              <CrossPerson />
            )}
          </div>
          {popupId === row.custom_event_id && (
            <PermissionYesOrNoPopup
              changeHandler={(key) =>
                changeHandler(
                  key,
                  row.custom_event_id,
                  "view",
                  row.custom_event_label
                )
              }
              anchorEl={anchorViewEl}
              handleClose={handleCloseViewPopup}
            />
          )}
        </div>
      ),
    },
  ];
  const { data: fields, isLoading } = useQuery(
    ["GET_ACTIONS_BY_TABLE_SLUG", table_slug, isOpen],
    () =>
      actionPermissionService.getList({
        role_id: roleId,
        table_slug,
      }),
    { enabled: !!table_slug }
  );
  const { mutate } = useMutation(
    (data) =>
      constructorObjectService.updateMultiple("action_permission", {
        data: {
          objects: data.map((i) => ({
            permission: i?.view && i?.view === "Yes",
            custom_event_id: i.id,
            table_slug,
            role_id: roleId,
          })),
        },
        updated_fields: ["role_id", "custom_event_id"],
      }),
    {
      onSuccess: () => {
        handleClose();
        setFinalData([]);
      },
    }
  );

  const changeHandler = useCallback(
    (key, id, type, label) =>
      finalData.find((i) => i.id === id)
        ? setFinalData((p) =>
            p.map((i) => {
              if (i.id === id) {
                return {
                  ...i,
                  id,
                  [type]: key,
                  label,
                };
              } else return i;
            })
          )
        : setFinalData((p) => [...p, { [type]: key, id, label }]),
    [finalData]
  );

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className={styles.fieldPermissionBox}>
          <div className={styles.head}>
            <p>Action settings</p>
            <Clear
              htmlColor="#6E8BB7"
              onClick={handleClose}
              style={{ cursor: "pointer" }}
            />
          </div>
          <div className={styles.body}>
            <DataTable
              removableHeight={"auto"}
              columns={columns}
              data={fields?.data?.action_permission ?? []}
              loader={isLoading}
              disableFilters
              disablePagination
            />
          </div>
          <div className={styles.submit_btn}>
            <PrimaryButton onClick={() => mutate(finalData)}>
              Сохранить
            </PrimaryButton>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ActionPermissionModal;
