import React, { useEffect, useRef, useState } from "react";
import Barcode from "react-barcode";
import styles from "./style.module.scss";
import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";
import BarcodeGenerateButton from "./BarcodeGenerateButton";
import PrintIcon from "@mui/icons-material/Print";
import Dialog from "@mui/material/Dialog";
import FRow from "../FormElements/FRow";
import ClearIcon from "@mui/icons-material/Clear";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
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
const BarcodeGenerator = ({
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
  field,
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
                  type="number"
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
                    value={value}
                    width={1}
                    height={35}
                    fontSize={10}
                    // format="EAN13"
                  />
                )}
              </div>

              {field?.attributes?.disabled === false ? (
                <BarcodeGenerateButton
                onChange={onChange}
                tableSlug={formTableSlug}
              />
              ) : ('')}
            </>
          );
        }}
      ></Controller>
    </div>
  );
};

export default BarcodeGenerator;

// let divContents = document.getElementById("barcodes").innerHTML;
// const meta = `<head><meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\"></head><style></style>`;

// await documentTemplateService
//   .exportToPDF({
//     data: {
//       table_slug: tableSlug,
//       object_id: id,
//       page_height: 20,
//       page_width: 30,
//     },
//     html: `${meta} <div class="ck-content" style="width: ${30}mm" >${divContents}</div>`,
//   })
//   .then((res) => {
//     console.log("RES", res);
//   });
