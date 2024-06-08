import { Add } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { CTableCell, CTableRow } from "../CTable";
import styles from './style.module.scss'


const TableRowButton = ({ colSpan=2, onClick=()=>{}, title="Добавить", loader }) => {
  return ( <CTableRow>
    <CTableCell colSpan={colSpan}>
      <div
        className={styles.createButton}
        onClick={onClick}
      >
        {loader ? <CircularProgress size={16} className="mr-2" /> : 
        <Add color="primary" />}
        <p>{title}</p>

      </div>
    </CTableCell>
  </CTableRow> );
}
 
export default TableRowButton;