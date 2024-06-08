import { Delete } from "@mui/icons-material";
import { useMemo } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import { useQuery } from "react-query";
import RectangleIconButton from "../../../../../../components/Buttons/RectangleIconButton";
import FRow from "../../../../../../components/FormElements/FRow";
import HFSelect from "../../../../../../components/FormElements/HFSelect";
import constructorFieldService from "../../../../../../services/constructorFieldService";
import listToOptions from "../../../../../../utils/listToOptions";
import FormulaFilters from "./FormulaFilters";
import styles from "./style.module.scss";

const formulaTypes = [
  { label: "Сумма", value: "SUMM" },
  { label: "Максимум", value: "MAX" },
  { label: "Среднее", value: "AVG" },
];

const FormulaAttributes = ({ control, mainForm }) => {
  const tableRelations = useWatch({
    control: mainForm.control,
    name: "tableRelations",
  });

  const selectedTableSlug = useWatch({
    control,
    name: "attributes.table_from",
  });

  const selectedTableslug = selectedTableSlug?.split("#")?.[0];

  const type = useWatch({
    control,
    name: "attributes.type",
  });

  const {
    fields: relation,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "attributes.formula_filters",
  });

  const deleteSummary = (index) => {
    remove(index);
  };

  const addNewSummary = () => {
    append({
      key: "",
      value: "",
    });
  };

  const computedTables = useMemo(() => {
    return tableRelations?.map((relation) => {
      const relatedTable = relation[relation.relatedTableSlug];

      return {
        label: relatedTable?.label,
        value: `${relatedTable?.slug}#${relation?.id}`,
      };
    });
  }, [tableRelations]);

  const { data: fields } = useQuery(
    ["GET_TABLE_FIELDS", selectedTableslug],
    () => {
      if (!selectedTableslug) return [];
      return constructorFieldService.getList({ table_slug: selectedTableslug });
    },
    {
      select: ({ fields }) =>
        listToOptions(
          fields?.filter((field) => field.type !== "LOOKUP"),
          "label",
          "slug"
        ),
    }
  );

  return (
    <>
      <div className={styles.settingsBlockHeader}>
        <h2>Settings</h2>
      </div>
      <div className="p-2">
        <FRow label="Formula type">
          <HFSelect
            name="attributes.type"
            control={control}
            options={formulaTypes}
          />
        </FRow>

        {(type === "SUMM" || type === "MAX" || type === 'AVG') && (
          <>
            <FRow label="Table from">
              <HFSelect
                name="attributes.table_from"
                control={control}
                options={computedTables}
              />
            </FRow>

            <FRow label="Field from">
              <HFSelect
                name="attributes.sum_field"
                control={control}
                options={fields}
              />
            </FRow>

            <FRow label="Filters"></FRow>

            <div className="">
              {relation?.map((summary, index) => (
                <FormulaFilters
                  summary={summary}
                  selectedTableSlug={selectedTableSlug}
                  index={index}
                  control={control}
                  deleteSummary={deleteSummary}
                />
              ))}
              <div className={styles.summaryButton} onClick={addNewSummary}>
                <button type="button">+ Создать новый</button>
              </div>
            </div>
          </>
        )}

        {/* <FRow label="Table to"  >
        <HFSelect
          name="attributes.table_to"
          control={control}
          options={formulaTypes}
        />
      </FRow> */}
      </div>
    </>
  );
};

export default FormulaAttributes;
