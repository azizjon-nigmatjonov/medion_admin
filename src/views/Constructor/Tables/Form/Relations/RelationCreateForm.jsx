import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import HFSelect from "../../../../../components/FormElements/HFSelect";
import { relationTyes } from "../../../../../utils/constants/relationTypes";
import DrawerCard from "../../../../../components/DrawerCard";
import FRow from "../../../../../components/FormElements/FRow";
import { useQuery } from "react-query";
import constructorFieldService from "../../../../../services/constructorFieldService";
import listToOptions from "../../../../../utils/listToOptions";
import HFMultipleSelect from "../../../../../components/FormElements/HFMultipleSelect";
import { useParams } from "react-router-dom";
import applicationService from "../../../../../services/applicationSercixe";
import style from "./style.module.scss";
import HFCheckbox from "../../../../../components/FormElements/HFCheckbox";
import constructorObjectService from "../../../../../services/constructorObjectService";
import { PlusIcon } from "../../../../../assets/icons/icon";

const options = [
  {
    value: "sum",
    label: "Sum ()",
  },
  {
    value: "average",
    label: "Avg ()",
  },
];

const RelationCreateForm = ({
  onSubmit,
  closeDrawer,
  initialValues = {},
  open,
  isLoading = false,
}) => {
  const { appId } = useParams();
  const [fieldOptions, setFieldOptions] = useState([]);
  const [openSumCreate, setOpenSumCreate] = useState(false);

  const { handleSubmit, control, reset, watch } = useForm();

  const values = watch();
  const type = watch("type");

  const relatedTableSlug = useMemo(() => {
    if (values.type === "Many2One") return values.table_to;
    if (values.type === "One2Many" || values.type === "Recursive")
      return values.table_from;
    return null;
  }, [values]);

  const getFieldOptions = (table_from) => {
    if (!table_from) return null;
    constructorObjectService.getList(table_from, { data: {} }).then((res) => {
      setFieldOptions((prev) => [
        ...prev,
        ...res?.data?.fields?.map((item) => ({
          label: item?.label,
          value: item?.slug,
        })),
      ]);
    });
  };

  const { data: relatedTableFields } = useQuery(
    ["GET_TABLE_FIELDS", relatedTableSlug],
    () => {
      if (!relatedTableSlug) return [];
      return constructorFieldService.getList({ table_slug: relatedTableSlug });
    },
    {
      select: ({ fields }) => {
        return listToOptions(
          fields?.filter((field) => field.type !== "LOOKUP"),
          "label",
          "id"
        );
      },
    }
  );

  useEffect(() => {
    if (type === "Many2One") {
      getFieldOptions(values?.table_from);
    } else {
      getFieldOptions(values?.table_from);
      getFieldOptions(values?.table_to);
    }
  }, [type]);

  const { data: app } = useQuery(["GET_TABLE_LIST", appId], () => {
    return applicationService.getById(appId);
  });

  const computedTablesList = useMemo(() => {
    return app?.tables?.map((table) => ({
      value: table.slug,
      label: table.label,
    }));
  }, [app]);

  const isRecursiveRelation = useMemo(() => {
    return values.type === "Recursive";
  }, [values.type]);

  const computedRelationsTypesList = useMemo(() => {
    return relationTyes.map((type) => ({
      value: type,
      label: type,
    }));
  }, []);

  const submitHandler = (values) => {
    const data = {
      ...values,
      summaries: [
        ...values.summaries,
        {
          field_name: values.field_name,
          formula_name: values.formula_name,
        },
      ],
    };

    delete data?.field_name;
    delete data?.formula_name;
    onSubmit({
      // ...values,
      ...data,
      summaries: data?.summaries?.filter((sum) => sum?.field_name?.length > 0),
      table_to: isRecursiveRelation ? values.table_from : values.table_to,
    });
    setOpenSumCreate(false);
    setFieldOptions([]);
  };

  useEffect(() => {
    reset({
      table_from: initialValues?.table_from?.slug ?? "",
      table_to: initialValues?.table_to?.slug ?? "",
      type: initialValues?.type ?? "",
      id: initialValues?.id ?? "",
      editable: initialValues?.editable ?? false,
      summaries: initialValues?.summaries ?? [],
      view_fields: initialValues?.view_fields?.map((field) => field.id) ?? [],
    });
  }, [open]);

  return (
    <DrawerCard
      title={initialValues === "CREATE" ? "Create relation" : "Edit relation"}
      onClose={() => {
        closeDrawer();
        setOpenSumCreate(false);
        setFieldOptions([]);
      }}
      open={open}
      onSaveButtonClick={handleSubmit(submitHandler)}
      loader={isLoading}
      bodyStyle={{ padding: "0" }}
    >
      <form onSubmit={handleSubmit(submitHandler)}>
        <FRow label="Table from" style={{ padding: "16px" }}>
          <HFSelect
            name="table_from"
            control={control}
            placeholder="Field Label"
            options={computedTablesList}
            autoFocus
            required
          />
        </FRow>

        {!isRecursiveRelation && (
          <FRow label="Table to" style={{ padding: "16px" }}>
            <HFSelect
              name="table_to"
              control={control}
              placeholder="Field Label"
              options={computedTablesList}
              required
            />
          </FRow>
        )}

        <FRow label="Relation type" style={{ padding: "16px" }}>
          <HFSelect
            name="type"
            control={control}
            placeholder="Field Label"
            options={computedRelationsTypesList}
            required
          />
        </FRow>

        <FRow label="Fields" style={{ padding: "16px" }}>
          <HFMultipleSelect
            name="view_fields"
            control={control}
            options={relatedTableFields}
            allowClear
          />
        </FRow>

        {/* Summary */}

        <div className={style.summary}>
          <div style={{ padding: "8px 16px" }} className={style.summaryTop}>
            <div>Summary</div>
            <HFCheckbox
              control={control}
              name="editable"
              value={values?.editable}
            />
          </div>
        </div>
        <div className={style.summaryBottom}>
          {values?.summaries?.map((el, index) => (
            <div className={style.summaryItem} style={{ marginTop: "8px" }}>
              <HFSelect
                options={fieldOptions}
                control={control}
                name={`summaries[${index}].field_name`}
                // value={el?.field_name}
                required
                onChange={(e) => {}}
              />
              <HFSelect
                options={options}
                control={control}
                name={`summaries[${index}].formula_name`}
                // value={summary?.formula_name}
                required
              />
            </div>
          ))}
          {openSumCreate ? (
            <div className={style.summaryItem} style={{ marginTop: "8px" }}>
              <HFSelect
                options={fieldOptions}
                control={control}
                name="field_name"
                required
              />
              <HFSelect
                options={options}
                control={control}
                name="formula_name"
                required
              />
            </div>
          ) : null}
          <div className={style.summaryButton}>
            {!openSumCreate ? (
              <button type="button" onClick={() => setOpenSumCreate(true)}>
                <PlusIcon />
                Создать новый
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setOpenSumCreate(false);
                }}
                style={{ borderColor: "red" }}
              >
                Отмена
              </button>
            )}
          </div>
        </div>
      </form>
    </DrawerCard>
  );
};

export default RelationCreateForm;
