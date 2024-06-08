import { useMemo } from "react";
import { Parser } from "hot-formula-parser";

const parser = new Parser();

const FormulaCell = ({ field, row }) => {
  const formula = field?.attributes?.formula ?? "";

  const computedValue = useMemo(() => {
    let computedFormula = formula;

    const sortedRowProperties = Object.entries(row ?? {}).sort(
      (a, b) => b[0].length - a[0].length
    );

    sortedRowProperties.forEach((i) => {
      let value = i[1] ?? 0;

      if (typeof value === "string") value = `${value}`;
      if (typeof value === "boolean")
        value = JSON.stringify(value).toUpperCase();
      computedFormula = computedFormula.replaceAll(`${i[0]}`, value);
    });

    const { result, error } = parser.parse(computedFormula);

    if (error) return "Err";
    return result;
  }, [formula, row]);

  return <span>{computedValue}</span>;
};

export default FormulaCell;
