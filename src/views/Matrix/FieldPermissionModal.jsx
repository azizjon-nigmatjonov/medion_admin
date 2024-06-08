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
import styles from "./styles.module.scss";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import ViewPermission from "./ViewPermission";

const FieldPermissionModal = ({ isOpen, handleClose, table_slug }) => {
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

  const handleOpenEditPopup = (event) => {
    setAnchorEditEl(event.currentTarget);
  };
  const handleCloseEditPopup = () => {
    setAnchorEditEl(null);
  };

  const columns = [
    {
      id: 1,
      label: "Field name",
      slug: "label",
      type: "SINGLE_LINE",
    },
    {
      id: 2,
      label: "View permission",
      slug: "view_permission",
      type: "SINGLE_LINE",
      render: (val, row) => (
        <div
          onClick={(e) => {
            anchorViewEl ? handleCloseViewPopup() : handleOpenViewPopup(e);
            setPopupId(row.field_id);
          }}
        >
          <div style={{ textAlign: "center" }}>
            {finalData.find((i) => i.id === row.field_id)?.["view"] ? (
              finalData.find((i) => i.id === row.field_id)?.["view"] ===
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
          {popupId === row.field_id && (
            <PermissionYesOrNoPopup
              changeHandler={(key) =>
                changeHandler(key, row.field_id, "view", row.field_label)
              }
              anchorEl={anchorViewEl}
              handleClose={handleCloseViewPopup}
            />
          )}
        </div>
      ),
    },
    {
      id: 3,
      label: "Edit permission",
      slug: "edit_permission",
      type: "SINGLE_LINE",
      render: (val, row) => (
        <div
          onClick={(e) => {
            anchorEditEl ? handleCloseEditPopup() : handleOpenEditPopup(e);
            setPopupId(row.field_id);
          }}
        >
          <div style={{ textAlign: "center" }}>
            {finalData.find((i) => i.id === row.field_id)?.["edit"] ? (
              finalData.find((i) => i.id === row.field_id)?.["edit"] ===
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
          {popupId === row.field_id && (
            <PermissionYesOrNoPopup
              changeHandler={(key) =>
                changeHandler(key, row.field_id, "edit", row.field_label)
              }
              anchorEl={anchorEditEl}
              handleClose={handleCloseEditPopup}
            />
          )}
        </div>
      ),
    },
  ];

  const { data: fields, isLoading } = useQuery(
    ["GET_FIELDS_BY_TABLE_SLUG", table_slug, isOpen],
    () =>
      constructorFieldService.getFieldPermission({
        table_slug,
        role_id: roleId,
      }),
    { enabled: !!table_slug }
  );

  const { mutate } = useMutation(
    (data) =>
      constructorObjectService.updateMultiple("field_permission", {
        data: {
          objects: data.map((i) => ({
            view_permission: i?.view && i?.view === "Yes",
            edit_permission: i?.edit && i?.edit === "Yes",
            field_id: i.id,
            // field_label: i.label,
            table_slug,
            role_id: roleId,
          })),
        },
        updated_fields: ["role_id", "field_id"],
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
            <p>View settings</p>
            <Clear
              htmlColor="#6E8BB7"
              onClick={handleClose}
              style={{ cursor: "pointer" }}
            />
          </div>
          <Tabs>
            <TabList>
              <Tab>Field Permission</Tab>
              <Tab>View Permission</Tab>
            </TabList>
            <TabPanel>
              <div className={styles.body}>
                <DataTable
                  removableHeight={"auto"}
                  columns={columns}
                  data={fields?.data?.field_permissions ?? []}
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
            </TabPanel>
            <TabPanel>
              <ViewPermission
                isOpen={isOpen}
                handleClose={handleClose}
                table_slug={table_slug}
              />
            </TabPanel>
          </Tabs>
        </div>
      </Modal>
    </div>
  );
};

export default FieldPermissionModal;
