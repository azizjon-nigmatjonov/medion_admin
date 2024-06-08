import { Checkbox } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import { selectedRowActions } from "../../store/selectedRow/selectedRow.slice";
import { CTableHeadCell } from "../CTable";

const CellCheckboxNoSign = ({ formVisible, data }) => {
  const dispatch = useDispatch();

  const [showCheckbox, setShowCheckbox] = useState(false);
  const selectedRow = useSelector((state) => state.selectedRow.selected);

  const checkboxVisibilityTrigger = (bool) => {
    if (bool) {
      if (!showCheckbox) {
        setShowCheckbox(true);
      }
    } else {
      if (showCheckbox) {
        setShowCheckbox(false);
      }
    }
  };

  const checkboxHandler = (_, value) =>
    value
      ? dispatch(selectedRowActions.addRowId(data.map((i) => i.guid)))
      : dispatch(selectedRowActions.clear());

  return formVisible ? (
    <CTableHeadCell
      onMouseEnter={() => checkboxVisibilityTrigger(true)}
      onMouseLeave={() => checkboxVisibilityTrigger(false)}
      style={{ padding: "2px 0", minWidth: "40px" }}
    >
      {showCheckbox || data.length === selectedRow.length ? (
        <Checkbox onChange={checkboxHandler} />
      ) : (
        "№"
      )}
    </CTableHeadCell>
  ) : (
    <CTableHeadCell width={10}>№</CTableHeadCell>
  );
};

export default CellCheckboxNoSign;
