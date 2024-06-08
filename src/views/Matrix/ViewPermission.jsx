import { useCallback, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import PermissionYesOrNoPopup from "./PermissionYesOrNoPopup";
import DataTable from "../../components/DataTable";
import { CrossPerson, TwoUserIcon } from "../../assets/icons/icon";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import constructorObjectService from "../../services/constructorObjectService";
import viewPermissionService from "../../services/ViewPermission";
import styles from "./styles.module.scss";

const ActionPermissionModal = ({ isOpen, handleClose, table_slug }) => {
  const { roleId } = useParams();
  const param = useParams();
  const [anchorViewEl, setAnchorViewEl] = useState(null);
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
      label: "Relation name",
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
            setPopupId(row.relation_id);
          }}
        >
          <div style={{ textAlign: "center" }}>
            {finalData.find((i) => i.id === row.relation_id)?.["view"] ? (
              finalData.find((i) => i.id === row.relation_id)?.["view"] ===
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
          {popupId === row.relation_id && (
            <PermissionYesOrNoPopup
              changeHandler={(key) =>
                changeHandler(key, row.relation_id, "view", row.label)
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
    ["GET_VIEWS_BY_TABLE_SLUG", table_slug, isOpen],
    () =>
      viewPermissionService.getList({
        role_id: roleId,
        table_slug,
      }),
    { enabled: !!table_slug }
  );
  const { mutate } = useMutation(
    (data) =>
      constructorObjectService.updateMultiple("view_relation_permission", {
        data: {
          objects: data.map((i) => ({
            view_permission: i?.view && i?.view === "Yes",
            relation_id: i.id,
            table_slug,
            role_id: roleId,
          })),
        },
        updated_fields: ["role_id", "relation_id", "table_slug"],
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
      <div className={styles.viewPermissionBox}>
        <div className={styles.body}>
          <DataTable
            removableHeight={"auto"}
            columns={columns}
            data={fields?.data?.view_relation_permissions ?? []}
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
    </div>
  );
};

export default ActionPermissionModal;
