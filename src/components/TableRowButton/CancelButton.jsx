import { Add } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { CTableCell, CTableRow } from "../CTable";
import styles from './style.module.scss'
import RemoveIcon from '@mui/icons-material/Remove';

const TableCancelButton = ({ colSpan=2, onClick=()=>{}, title="Отменить", loader }) => {
    return ( <CTableRow>
        <CTableCell colSpan={colSpan}>
            <div
                className={styles.createButton}
                onClick={onClick}
            >
                {loader ? <CircularProgress size={16} className="mr-2" /> :
                    <RemoveIcon style={{ color: "#FF4842" }} />}
                <p className={styles.cancel}>{title}</p>

            </div>
        </CTableCell>
    </CTableRow> );
}

export default TableCancelButton;