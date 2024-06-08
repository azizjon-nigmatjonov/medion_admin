import React, { useEffect, useRef, useState } from "react";
import Barcode from "react-barcode";
import styles from "./styles.module.scss";
import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";
import CodabarGenerator from "./CodabarGenerator";
import PrintIcon from "@mui/icons-material/Print";
import Dialog from "@mui/material/Dialog";
import FRow from "../../FormElements/FRow";
import ClearIcon from "@mui/icons-material/Clear";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import ReactToPrint from "react-to-print";
const pageStyle = `
  @page {
    size: 30mm 20mm;
  }

  @media all {
    .pagebreak {
      display: none;
    }
  }

  @media print {
    .pagebreak {
      page-break-before: always;
    }
  }
`;
const CodabarBarcode = ({
  control,
  tabIndex,
  name = "",
  disabledHelperText = false,
  required = false,
  fullWidth = false,
  withTrim = false,
  rules = {},
  defaultValue = "",
  disabled,
  formTableSlug,
  ...props
}) => {
  const [count, setCount] = useState(1);
  const [open, setOpen] = useState(false);
  const ref = useRef();

  const handleClose = () => setOpen(false);

  return (
    <div className={styles.barcode_layer}>
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        rules={{
          required: required ? "This is required field" : false,
        }}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          return (
            <>
              <div className={styles.input_control}>
                <TextField
                  size="small"
                  value={value}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!val) onChange("");
                    else onChange(!isNaN(Number(val)) ? Number(val) : "");
                  }}
                  name={name}
                  error={error}
                  autoFocus={tabIndex === 1}
                  fullWidth={fullWidth}
                  InputProps={{
                    inputProps: { tabIndex },
                    readOnly: disabled,
                    max: 13,
                    style: disabled
                      ? {
                          background: "#c0c0c039",
                        }
                      : {},
                  }}
                  helperText={!disabledHelperText && error?.message}
                  {...props}
                />
                <ReactToPrint
                  trigger={() => (
                    <button className={styles.barcode_print}>
                      <PrintIcon />
                    </button>
                  )}
                  content={() => ref.current}
                  pageStyle={pageStyle}
                />
                <Dialog open={open} onClose={handleClose}>
                  <div className={styles.barcode_count}>
                    <button className={styles.cancel_btn} onClose={handleClose}>
                      <ClearIcon />
                    </button>
                    <div className={styles.barcode_input_layer}>
                      <FRow label="Print Count">
                        <input
                          type="number"
                          value={count}
                          placeholder="Count"
                          className={styles.count_control}
                          onChange={(e) => setCount(e.target.value)}
                        />
                      </FRow>
                      <PrimaryButton className={styles.barcode_print}>
                        Print
                      </PrimaryButton>
                    </div>
                  </div>
                </Dialog>
              </div>

              <div className="" id="barcodes">
                {value && (
                  <Barcode
                    ref={ref}
                    format='CODE39'
                    value={value}
                    width={1}
                    height={40}
                  />
                )}
              </div>

              <CodabarGenerator
                onChange={onChange}
                tableSlug={formTableSlug}
              />
            </>
          );
        }}
      ></Controller>
    </div>
  );
};

export default CodabarBarcode;
