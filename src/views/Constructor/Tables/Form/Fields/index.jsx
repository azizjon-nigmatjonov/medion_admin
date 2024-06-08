// import { Delete, Edit } from "@mui/icons-material"
import { Add } from "@mui/icons-material";
import { Drawer } from "@mui/material";
import { useMemo, useState } from "react";
import { useFieldArray } from "react-hook-form";
import { useParams } from "react-router-dom";
import { CTableCell, CTableRow } from "../../../../../components/CTable";
import DataTable from "../../../../../components/DataTable";
import TableCard from "../../../../../components/TableCard";
import constructorFieldService from "../../../../../services/constructorFieldService";
import { generateGUID } from "../../../../../utils/generateID";
import FieldSettings from "./FieldSettings";
import styles from "./style.module.scss";

const Fields = ({ mainForm }) => {
  const { id, slug } = useParams();
  const [formLoader, setFormLoader] = useState(false);
  const [drawerState, setDrawerState] = useState(null);

  const { fields, prepend, update, remove } = useFieldArray({
    control: mainForm.control,
    name: "fields",
    keyName: "key",
  });

  const createField = (field) => {
    const data = {
      ...field,
      id: generateGUID(),
    };

    if (!id) {
      prepend(data);
      setDrawerState(null);
    } else {
      setFormLoader(true);
      constructorFieldService
        .create(data)
        .then((res) => {
          prepend(res);
          setDrawerState(null);
        })
        .finally(() => setFormLoader(false));
    }
  };

  const updateField = (field) => {
    const index = fields.findIndex((el) => el.id === field.id);

    if (!id) {
      update(index, field);
      setDrawerState(null);
    } else {
      setFormLoader(true);
      constructorFieldService
        .update(field)
        .then((res) => {
          update(index, field);
          setDrawerState(null);
        })
        .finally(() => setFormLoader(false));
    }
  };

  const openEditForm = (field) => {
    setDrawerState(field);
  };

  const deleteField = (field, index) => {
    if (!id) remove(index);
    else {
      constructorFieldService.delete(field.id).then((res) => remove(index));
    }
  };

  const onFormSubmit = (values) => {
    if (drawerState === "CREATE") {
      createField(values);
    } else {
      updateField(values);
    }
  };

  const columns = useMemo(
    () => [
      {
        id: 1,
        label: "Field Label",
        slug: "label",
      },
      {
        id: 2,
        label: "Field SLUG",
        slug: "slug",
      },
      {
        id: 3,
        label: "Field type",
        slug: "type",
      },
    ],
    []
  );

  return (
    <TableCard>
      <DataTable
        data={fields}
        removableHeight={false}
        columns={columns}
        disablePagination
        dataLength={1}
        tableSlug={"app"} // talk with Backend
        // loader={loader}
        onDeleteClick={deleteField}
        onEditClick={openEditForm}
        additionalRow={
          // <PermissionWrapperV2 tabelSlug={slug} type="write">
          <CTableRow>
            <CTableCell colSpan={columns.length + 1}>
              <div
                className={styles.createButton}
                onClick={() => setDrawerState("CREATE")}
              >
                <Add color='primary' />
                <p>Добавить</p>
              </div>
            </CTableCell>
          </CTableRow>
          // </PermissionWrapperV2>
        }
      />

      <Drawer
        open={drawerState}
        anchor='right'
        onClose={() => setDrawerState(null)}
        orientation='horizontal'
      >
        <FieldSettings
          closeSettingsBlock={() => setDrawerState(null)}
          onSubmit={(index, field) => update(index, field)}
          field={drawerState}
          formType={drawerState}
          mainForm={mainForm}
          height={`calc(100vh - 48px)`}
        />
      </Drawer>

      {/* <FieldCreateForm
        open={drawerState}
        initialValues={drawerState}
        formIsVisible={drawerState}
        closeDrawer={() => setDrawerState(null)}
        onSubmit={onFormSubmit}
        isLoading={formLoader}
        mainForm={mainForm}
      /> */}
    </TableCard>
  );
};

export default Fields;
