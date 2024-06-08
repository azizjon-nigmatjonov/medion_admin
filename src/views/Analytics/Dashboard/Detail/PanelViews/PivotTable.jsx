import React, { useState } from "react";
import styles from "./style.module.scss";
import PivotTableUI from "react-pivottable/PivotTableUI";
import "react-pivottable/pivottable.css";

const PivotTable = ({ panel = {}, data = [] }) => {
  const [pivotData, setPivotData] = useState({});

  const chartAttributes = panel?.attributes?.["PIVOT_TABLE"] ?? {};
  return (
    <div className={styles.card}>
      {/* <div className={styles.title}>{panel?.title}</div> */}
      <PivotTableUI
        id="pivot"
        data={data}
        onChange={(s) => setPivotData(s)}
        aggregatorName="Integer Sum"
        // cols={[
        //   chartAttributes.value_field_slug,
        //   chartAttributes.value_field_slug2,
        // ]}
        // rows={[
        //   chartAttributes.label_field_slug,
        //   chartAttributes.label_field_slug2,
        // ]}
        vals={["amount"]}
        {...pivotData}
        hiddenAttributes={[
          "pvtRenderers",
          "pvtAxisContainer",
          "pvtVals",
          "pvtAxisContainer",
        ]}
        hiddenFromAggregators={["id", "companyid"]}
      />
      {/* <div className={styles.chartArea}></div> */}
    </div>
  );
};

export default PivotTable;
