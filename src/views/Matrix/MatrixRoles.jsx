import { Delete } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import RectangleIconButton from "../../components/Buttons/RectangleIconButton";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "../../components/CTable";
import FormCard from "../../components/FormCard";
import FRow from "../../components/FormElements/FRow";
import HFTextField from "../../components/FormElements/HFTextField";
import constructorObjectService from "../../services/constructorObjectService";
import roleServiceV2 from "../../services/roleServiceV2";
import styles from "./styles.module.scss";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../components/Buttons/SecondaryButton";

const MatrixRoles = ({ infoForm }) => {
  const { control, handleSubmit, reset } = useForm({});
  const navigate = useNavigate();
  const params = useParams();

  const [roles, setRoles] = useState([]);
  const [showAddBlock, setShowAddBlock] = useState(false);

  const getRoles = () => {
    roleServiceV2
      .getList({ "client-type-id": infoForm.getValues().clientTypeId })
      .then((res) => {
        setRoles(res?.data?.response || []);
      })
      .catch((err) => {});
  };

  const deleteLogins = (table_slug, id) => {
    constructorObjectService
      .delete(table_slug, id)
      .then(() => getRoles())
      .catch((e) => {});
  };

  const { mutate, isLoading } = useMutation(
    (data) =>
      constructorObjectService.create("role", {
        data: {
          project_id: import.meta.env.VITE_AUTH_PROJECT_ID,
          client_platform_id: params.platformId,
          client_type_id: params.typeId,
          name: data.name,
        },
      }),
    {
      onSuccess: () => {
        getRoles();
        reset({ name: "" });
      },
    }
  );

  const onSubmit = (data) => mutate(data);

  useEffect(() => {
    getRoles();
  }, []);

  return (
    <div>
      <FormCard title="Инфо" icon="address-card.svg" maxWidth="100%">
        <FRow label="Название">
          <HFTextField name="userType" control={infoForm.control} fullWidth />
        </FRow>
      </FormCard>
      <div style={{ marginTop: "10px" }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CTable removableHeight={null} disablePagination>
            <CTableHead>
              <CTableRow>
                <CTableCell style={{ padding: "12px 20px" }}>
                  Название
                </CTableCell>
              </CTableRow>
            </CTableHead>
            <CTableBody loader={false} columnsCount={1} dataLength={1}>
              {roles.map((role) => (
                <CTableRow
                  key={role.guid}
                  onClick={() =>
                    navigate(
                      `/settings/auth/matrix_v2/role/${role?.guid}/${params?.typeId}`
                    )
                  }
                >
                  <CTableCell
                    style={{
                      padding: "8px 20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>{role.name}</span>
                    <RectangleIconButton
                      color="error"
                      onClick={() => deleteLogins("role", role.guid)}
                    >
                      <Delete color="error" />
                    </RectangleIconButton>
                  </CTableCell>
                </CTableRow>
              ))}
            </CTableBody>
            <div className={styles.role_add_block}>
              {showAddBlock && (
                <div className={styles.action}>
                  <HFTextField
                    required
                    label="Название"
                    name="name"
                    control={control}
                    fullWidth
                  />
                  <SecondaryButton
                    disabled={isLoading}
                    type="button"
                    onClick={() => {
                      setShowAddBlock(false);
                      reset({ name: "" });
                    }}
                  >
                    Отменить
                  </SecondaryButton>
                  <PrimaryButton disabled={isLoading} type="submit">
                    Сохранить
                  </PrimaryButton>
                </div>
              )}
              <button
                type="button"
                className={`${styles.role_add_btn} ${
                  showAddBlock ? styles.disabled : ""
                }`}
                onClick={() => (showAddBlock ? null : setShowAddBlock(true))}
              >
                Добавить
              </button>
            </div>
          </CTable>
        </form>
      </div>
    </div>
  );
};

export default MatrixRoles;
