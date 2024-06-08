import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox } from "@mui/material";

import { selectedRowActions } from "../../store/selectedRow/selectedRow.slice";
import { CTableCell } from "../CTable";

const CellCheckboxOrOrderNumBlock = ({ row, currentPage, limit, rowIndex }) => {
  const [showCheckbox, setShowCheckbox] = useState(false);
  const dispatch = useDispatch();
  const selectedRow = useSelector((state) => state.selectedRow.selected);

  const checkboxHandler = (_, value) =>
    value
      ? dispatch(selectedRowActions.addRowId(row.guid))
      : dispatch(selectedRowActions.removeRowId(row.guid));

  return (
    <CTableCell
      onMouseEnter={() => setShowCheckbox(true)}
      onMouseLeave={() => setShowCheckbox(false)}
      style={{ padding: 0, textAlign: "center" }}
    >
      {showCheckbox || selectedRow.some((i) => i === row.guid) ? (
        <Checkbox
          onChange={checkboxHandler}
          checked={selectedRow.some((i) => i === row.guid)}
        />
      ) : (
        (currentPage - 1) * limit + rowIndex + 1
      )}
    </CTableCell>
  );
};

export default CellCheckboxOrOrderNumBlock;
