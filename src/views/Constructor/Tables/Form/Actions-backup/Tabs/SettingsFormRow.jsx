import { Add, Delete } from "@mui/icons-material";
import { useFieldArray } from "react-hook-form";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

import SecondaryButton from "../../../../../../components/Buttons/SecondaryButton";
import HFSelect from "../../../../../../components/FormElements/HFSelect";
import { FormulaIcon, XIcon } from "../../../../../../assets/icons/icon";
import HFTextField from "../../../../../../components/FormElements/HFTextField";
import constructorFieldService from "../../../../../../services/constructorFieldService";

const SettingsFormRow = ({
  watch,
  control,
  nestedIndex,
  nestedFieldName,
  removeField,
}) => {
  const { slug: table_slug } = useParams();

  const table_slug_param =
    nestedFieldName === "after"
      ? watch(`after.${nestedIndex}.table`)
      : table_slug;

  const { data: fieldList, isLoading: fieldListLoading } = useQuery(
    [
      "GET_FIELD_LIST",
      table_slug,
      watch(`after.${nestedIndex}.table`),
      table_slug_param,
    ],
    () =>
      constructorFieldService.getList({
        table_slug: table_slug_param || table_slug,
      }),
    {
      enabled: !!table_slug,
    }
  );

  const { fields, append, remove } = useFieldArray({
    control,
    name: `${nestedFieldName}.${nestedIndex}.group`,
  });

  const attributeFields = [
    {
      defaultValue: "",
      slug: "left_field",
      type: (val) => (val === "drugoye" ? "text" : "select"),
      options: fieldList?.fields?.map((i) => ({
        label: i.slug,
        value: i.slug,
      })),
      isLoading: fieldListLoading,
      placeholder: "current",
    },
    {
      defaultValue: "=",
      slug: "comparison_symbol",
      type: () => "select",
      options: [
        {
          label: (
            <KeyboardArrowLeftIcon style={{ transform: "translateY(3px)" }} />
          ),
          value: ">",
        },
        {
          label: <DragHandleIcon style={{ transform: "translateY(3px)" }} />,
          value: "=",
        },
        {
          label: (
            <KeyboardArrowRightIcon style={{ transform: "translateY(3px)" }} />
          ),
          value: "<",
        },
      ],
      width: "200px",
      placeholder: "=",
    },
    {
      defaultValue: "f",
      slug: "right_field_type",
      type: () => "select",
      options: [
        {
          label: <FormulaIcon style={{ transform: "translateY(3px)" }} />,
          value: "formula",
        },
        {
          label: <XIcon style={{ transform: "translateY(3px)" }} />,
          value: "static_value",
        },
      ],
      width: "200px",
      placeholder: "f",
    },
    {
      defaultValue: "middle",
      slug: "right_field",
      type: () => "text",
      options: ["start", "middle", "end"],
      placeholder: "text",
    },
  ];

  return (
    fields.length > 0 && (
      <div>
        {fields.map((field, index) => (
          <div
            key={field.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: 8,
            }}
          >
            {attributeFields.map((field) =>
              field.type(
                watch(
                  `${nestedFieldName}.${nestedIndex}.group.${index}.${field.slug}`
                )
              ) === "select" ? (
                <HFSelect
                  key={field.id}
                  options={field.options}
                  control={control}
                  name={`${nestedFieldName}.${nestedIndex}.group.${index}.${field.slug}`}
                  width={field?.width}
                  loading={field.isLoading}
                  style={{ height: 35 }}
                  placeholder={field.placeholder}
                />
              ) : (
                <HFTextField
                  key={field.id}
                  control={control}
                  name={`${nestedFieldName}.${nestedIndex}.group.${index}.${field.slug}`}
                  fullWidth
                  placeholder={field.placeholder}
                />
              )
            )}

            <div
              onClick={() => remove(index)}
              style={{
                border: "1px solid #dbe0e4",
                height: 36,
                padding: "0 7px",
                lineHeight: "44px",
                cursor: "pointer",
                borderRadius: 2,
              }}
            >
              <Delete htmlColor="#F76659" />
            </div>
          </div>
        ))}
        <div style={{ display: "flex", gap: 8 }}>
          <SecondaryButton
            type="button"
            style={{ width: "100%" }}
            onClick={() =>
              append({
                left_field: "",
                right_field: "",
                comparison_symbol: "",
                right_field_type: "",
              })
            }
          >
            <Add />
            Добавить группу
          </SecondaryButton>
          <SecondaryButton
            type="button"
            style={{ borderStyle: "dashed", width: "100%" }}
            onClick={() => removeField(nestedIndex)}
          >
            <Delete />
            Удалить
          </SecondaryButton>
        </div>
      </div>
    )
  );
};

export default SettingsFormRow;
