import { Pagination } from "@mui/material";
import CSelect from "../CSelect";
import styles from "./style.module.scss";

const CPagination = ({
  setCurrentPage = () => {},
  paginationExtraButton,
  limit,
  setLimit = () => {},
  ...props
}) => {
  const options = [
    {
      value: isNaN(parseInt(props?.defaultLimit))
        ? ""
        : parseInt(props?.defaultLimit),
      label: isNaN(parseInt(props?.defaultLimit))
        ? ""
        : parseInt(props?.defaultLimit),
    },
    { value: 10, label: 10 },
    { value: 15, label: 15 },
    { value: 20, label: 20 },
    { value: 25, label: 25 },
    { value: 30, label: 30 },
    { value: 35, label: 35 },
    { value: 40, label: 40 },
  ];

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "15px",
      }}
    >
      <div>
        {limit && (
          <div className={styles.limitSide}>
            Showing
            <CSelect
              options={options}
              disabledHelperText
              size="small"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              inputProps={{ style: { borderRadius: 50 } }}
              endAdornment={null}
              sx={null}
            />
          </div>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Pagination
          color="primary"
          onChange={(e, val) => setCurrentPage(val)}
          {...props}
        />
        {paginationExtraButton}
      </div>
    </div>
  );
};

export default CPagination;
