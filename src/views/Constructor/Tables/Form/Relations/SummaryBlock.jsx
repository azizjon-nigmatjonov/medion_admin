import { Delete } from "@mui/icons-material";
import { useFieldArray } from "react-hook-form";
import RectangleIconButton from "../../../../../components/Buttons/RectangleIconButton";
import HFSelect from "../../../../../components/FormElements/HFSelect";
import HFTextField from "../../../../../components/FormElements/HFTextField";
import styles from "./style.module.scss";

const formulaTypes = [
  {
    value: "sum",
    label: "Sum ()",
  },
  {
    value: "average",
    label: "Avg ()",
  },
];

const SummaryBlock = ({ control, computedFieldsListOptions }) => {
  const {
    fields: summaries,
    insert,
    remove,
  } = useFieldArray({
    control,
    name: "summaries",
    keyName: "key",
  });

  const addNewSummary = () => {
    insert({
      field_name: "",
      formula_name: "",
    });
  };

  const deleteSummary = (index) => {
    remove(index);
  };

  return (
    <>
      <div className={styles.settingsBlockHeader}>
        <h2>Summary</h2>
      </div>

      <div className="p-2">
        {summaries?.map((summary, index) => (
          <div key={summary.key} className="flex align-center gap-2 mb-2">
            <HFSelect
              options={computedFieldsListOptions}
              placeholder="Field"
              control={control}
              fullWidth
              name={`summaries[${index}].field_name`}
            />
            <HFSelect
              control={control}
              fullWidth
              placeholder="Formula"
              name={`summaries[${index}].formula_name`}
              options={formulaTypes}
            />
            <RectangleIconButton
              color="error"
              onClick={() => deleteSummary(index)}
            >
              <Delete color="error" />
            </RectangleIconButton>
          </div>
        ))}

        <div className={styles.summaryButton} onClick={addNewSummary}>
          <button type="button">+ Создать новый</button>
        </div>
      </div>
    </>
  );
};

export default SummaryBlock;
