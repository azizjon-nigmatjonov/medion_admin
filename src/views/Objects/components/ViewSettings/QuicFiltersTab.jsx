import { Checkbox } from "@mui/material";
import { useFieldArray } from "react-hook-form";
import { Container, Draggable } from "react-smooth-dnd";
import CSelect from "../../../../components/CSelect";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableRow,
} from "../../../../components/CTable";
import HFCheckbox from "../../../../components/FormElements/HFCheckbox";
import { applyDrag } from "../../../../utils/applyDrag";
import styles from "./style.module.scss";

const QuickFiltersTab = ({ form }) => {
  const { fields: quickFilters, move } = useFieldArray({
    control: form.control,
    name: "quick_filters",
    keyName: "key",
  });

  const onDrop = (dropResult) => {
    const result = applyDrag(quickFilters, dropResult);
    if (result) move(dropResult.removedIndex, dropResult.addedIndex);
  };

  return (
    <div>
      <div className={styles.table}>
        <Container
          onDrop={onDrop}
          dropPlaceholder={{ className: "drag-row-drop-preview" }}
        >
          {quickFilters.map((column, index) => (
            <Draggable key={column.id}>
              <QuickFilterRow
                key={column.id}
                column={column}
                index={index}
                control={form.control}
              />
            </Draggable>
          ))}
        </Container>
      </div>
    </div>
  );
};

const QuickFilterRow = ({ column, onCheckboxChange, index, control }) => {
  return (
    <div className={styles.row}>
      <div className={styles.cell} style={{ flex: 1 }}>
        {column.label}
      </div>
      <div className={styles.cell} style={{ width: 70 }}>
        <HFCheckbox
          control={control}
          name={`quick_filters[${index}].is_checked`}
        />
      </div>
    </div>
  );

  // return (
  //   <CTableRow>
  //     <CTableCell>{column.label}</CTableCell>
  //     <CTableCell style={{ width: 20 }}>
  //       <Checkbox
  //         checked={isActive}
  //         onChange={(e, val) => onCheckboxChange(val, column.id)}
  //       />
  //     </CTableCell>
  //     <CTableCell style={{ width: 250 }}>
  //       {isActive && <CSelect disabledHelperText />}
  //     </CTableCell>
  //   </CTableRow>
  // )
};

export default QuickFiltersTab;
