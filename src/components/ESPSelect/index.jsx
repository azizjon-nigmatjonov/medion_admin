import { Autocomplete, TextField } from "@mui/material";
import { useSelector } from "react-redux";
import styles from './style.module.scss'

const ESPselect = ({onChange = () => {}}) => {
  const keys = useSelector(state => state.esp.keysList)

  return (
    <Autocomplete
      id="keys"
      className="ESPselect"
      style={{ width: "100%" }}
      options={keys}
      loading={true}
      onChange={(_, val) => onChange(val)}
      getOptionLabel={option => option?.serialNumber + " --- " + option?.CN}
      // onChange={(_, val) => handleSelectedKey(val?.key)}
      renderOption={(props, option) => (
        <div className="option-block" {...props} key={option.id} style={{display: "flex", flexDirection: "column", alignItems: "flex-start", marginBottom: "15px"}} >
          <div className="row" style={{display: "flex", alignItems: "center"}} >
            {/* <VpnKey color="" style={{marginRight: "14px"}} /> */}
            <p><span className={styles.label} >Sertifikat No:</span> {option?.serialNumber}</p>
          </div>
          <div className="row">
            <p><span className={styles.label} >STIR:</span> {option?.TIN}</p>
          </div>
          <div className="row">
            <p><span className={styles.label} >F.I.SH:</span> {option?.CN}</p>
          </div>
        </div>
      )}
      renderInput={(params) => (
        <TextField {...params} placeholder="Выберите ЕЦП ключ" variant="outlined" />
      )}
    />
  );
};

export default ESPselect;
