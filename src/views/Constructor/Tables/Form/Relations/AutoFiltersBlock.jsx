import { Delete } from "@mui/icons-material";
import { useFieldArray } from "react-hook-form";
import { useQuery } from "react-query";

import RectangleIconButton from "../../../../../components/Buttons/RectangleIconButton";
import HFSelect from "../../../../../components/FormElements/HFSelect";
import constructorFieldService from "../../../../../services/constructorFieldService";
import styles from "./style.module.scss";

const AutoFiltersBlock = ({ control, watch }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "auto_filters",
  });

  const addNewAutoFilter = () => append({ field_from: "", field_to: "" });
  const deleteAutoFilter = (index) => remove(index);

  const { data: fieldFromList, isLoading: fieldFromListLoading } = useQuery(
    ["GET_FIELDS_LIST", watch("table_from")],
    () =>
      constructorFieldService.getList({
        table_slug: watch("table_from"),
      }),
    {
      enabled: !!watch("table_from"),
    }
  );

  const { data: fieldsToList, isLoading: fieldToListLoading } = useQuery(
    ["GET_FIELDS_LIST", watch("table_to")],
    () =>
      constructorFieldService.getList({
        table_slug: watch("table_to"),
      }),
    {
      enabled: !!watch("table_to"),
    }
  );

  const attributeFields = [
    {
      slug: "field_to",
      isLoading: fieldToListLoading,
      placeholder: "Field to",
      options: fieldsToList?.fields?.map((field) => ({
        label: field.slug,
        value: field.slug,
      })),
    },
    {
      slug: "field_from",
      isLoading: fieldFromListLoading,
      placeholder: "Field From",
      options: fieldFromList?.fields?.map((field) => ({
        label: field.slug,
        value: field.slug,
      })),
    },
  ];

  return (
    <>
      <div className={styles.settingsBlockHeader}>
        <h2>AutoFilters</h2>
      </div>
      <div className="p-2">
        {fields.map((field, index) => (
          <div className="flex align-center gap-2 mb-2" key={field.id}>
            {attributeFields.map((item, fieldIndex) => (
              <HFSelect
                key={fieldIndex}
                control={control}
                options={item.options}
                loading={item.isLoading}
                placeholder={item.placeholder}
                name={`auto_filters.${index}.${item.slug}`}
              />
            ))}
            <RectangleIconButton
              color="error"
              onClick={() => deleteAutoFilter(index)}
            >
              <Delete color="error" />
            </RectangleIconButton>
          </div>
        ))}
        <div className={styles.summaryButton} onClick={addNewAutoFilter}>
          <button type="button">+ Создать новый</button>
        </div>
      </div>
    </>
  );
};

export default AutoFiltersBlock;
