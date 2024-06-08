import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";

import { CTableCell } from "../CTable";
import CellFormElementGenerator from "../ElementGenerators/CellFormElementGenerator";
import "./style.scss";

const MultipleUpdateRow = ({
  columns,
  fields,
  watch,
  control,
  setFormValue,
}) => {
  return (
    <tr className="multipleRow">
      <CTableCell
        style={{
          padding: 0,
          color: "#fff",
          textAlign: "center",
        }}
      >
        <BorderColorOutlinedIcon style={{ paddingBottom: 3 }} />
      </CTableCell>

      {fields.map((field) => (
        <CTableCell
          key={field.id}
          style={{
            padding: 0,
          }}
        >
          <CellFormElementGenerator
            isBlackBg
            columns={columns}
            watch={watch}
            control={control}
            setFormValue={setFormValue}
            field={{ ...field, required: false }}
            row={{}}
          />
        </CTableCell>
      ))}
      <CTableCell></CTableCell>
    </tr>
  );
};

export default MultipleUpdateRow;
