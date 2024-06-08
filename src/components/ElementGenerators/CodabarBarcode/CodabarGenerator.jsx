import React from "react";
import styles from "./styles.module.scss";
import barcodeService from "../../../services/barcodeService";

function CodabarGenerator({ onChange, tableSlug }) {
  const generateBarcode = () => {
    barcodeService.getNumber(tableSlug).then((res) => {
      onChange(res?.number.slice(0, 12));
    });
  };

  return (
    <>
      <button className={styles.barcode_generate} onClick={generateBarcode}>
        Generate
      </button>
    </>
  );
}

export default CodabarGenerator;
