import React from "react";
import styles from "./style.module.scss";
import barcodeService from "../../services/barcodeService";

function BarcodeGenerateButton({ onChange, printBarcode, tableSlug }) {
  const generateBarcode = () => {
    barcodeService.getNumber(tableSlug).then((res) => {
      onChange(res?.number.slice(0, 10));
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

export default BarcodeGenerateButton;
