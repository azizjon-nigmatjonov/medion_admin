import { Delete } from "@mui/icons-material";
import { useFieldArray } from "react-hook-form";
import RectangleIconButton from "../../../../../components/Buttons/RectangleIconButton";
import HFSelect from "../../../../../components/FormElements/HFSelect";
import HFTextField from "../../../../../components/FormElements/HFTextField";
import styles from "./style.module.scss";

const relationActions = [
  {
    value: "go_to_page",
    label: "go_to_page",
  },
  {
    value: "select_checkbox",
    label: "select_checkbox",
  },
];

const SummaryBlock = ({ control }) => {
  const {
    fields: relation,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "action_relations",
    keyName: "key",
  });

  const addNewSummary = () => {
    append({
      key: "row_click_action",
      value: "",
    });
  };

  const deleteSummary = (index) => {
    remove(index);
  };

  return (
    <>
      <div className={styles.settingsBlockHeader}>
        <h2>Action Relation</h2>
      </div>

      <div className="p-2">
        {relation?.map((summary, index) => (
          <div key={summary.key} className="flex align-center gap-2 mb-2">
            <HFTextField
              control={control}
              name="row_click_action"
              value="Action Relation"
            />
            <HFSelect
              control={control}
              fullWidth
              placeholder="value"
              name={`action_relations[${index}].value`}
              options={relationActions}
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
