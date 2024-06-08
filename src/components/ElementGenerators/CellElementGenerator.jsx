import { get } from "@ngard/tiny-get";
import { useMemo } from "react";

import MultiselectCellColoredElement from "./MultiselectCellColoredElement";
import { getRelationFieldTableCellLabel } from "../../utils/getRelationFieldLabel";
import { numberWithSpaces } from "../../utils/formatNumbers";
import { parseBoolean } from "../../utils/parseBoolean";
import IconGenerator from "../IconPicker/IconGenerator";
import { formatDate } from "../../utils/dateFormatter";
import LogoDisplay from "../LogoDisplay";
import TableTag from "../TableTag";
import DownloadIcon from "@mui/icons-material/Download";
import Many2ManyValue from "./Many2ManyValue";
import PDFReader from "../PDFReader";

const CellElementGenerator = ({ field = {}, row }) => {
  
  const value = useMemo(() => {
    if (field.type !== "LOOKUP") return get(row, field.slug, "");

    const result = getRelationFieldTableCellLabel(
      field,
      row,
      field.slug + "_data"
    );

    return result;
  }, [row, field]);

  const tablesList = useMemo(() => {
    return (
      field.attributes?.dynamic_tables?.map((el) => {
        return el.table ? { ...el.table, ...el } : el;
      }) ?? []
    );
  }, [field.attributes?.dynamic_tables]);

  const getValue = useMemo(() => {
    let val = tablesList?.find((table) => value?.[`${table.slug}_id`]) ?? "";
    if (!val) return "";
    return value?.[`${val?.slug}_id_data`];
  }, [value, tablesList]);

  const computedInputString = useMemo(() => {
    let val = "";
    let getVal = tablesList
      ? tablesList?.find((table) => value?.[`${table.slug}_id`])
      : [];
    let viewFields = getVal?.view_fields;

    viewFields &&
      viewFields?.map((item) => {
        val += `${getValue ? getValue?.[item?.slug] + " " : ""}`;
      });

    return val;
  }, [getValue, tablesList, value]);

  if (field.render) {
    return field.render(row);
  }

  switch (field.type) {
    case "LOOKUPS":
      return <Many2ManyValue field={field} value={value} />;

    case "DATE":
      return <span className='text-nowrap'>{formatDate(value)}</span>;

    case "NUMBER":
      return numberWithSpaces(value);

    case "PDF_READER":
      return (
        <div style={{textAlign: "center"}}>
          <PDFReader value={value} />
        </div>
      );

    case "DATE_TIME":
      return (
        <span className='text-nowrap'>
          {formatDate(value, "DATE_TIME")}
          {/* {value ? format(new Date(value), "dd.MM.yyyy HH:mm") : "---"} */}
        </span>
      );

    case "MULTISELECT":
      return <MultiselectCellColoredElement field={field} value={value} />;

    case "MULTI_LINE":
      return (
        <div className='text-overflow'>
          <span
            dangerouslySetInnerHTML={{ __html: value + `${value && "..."}` }}
          ></span>
        </div>
      );

    case "CHECKBOX":
    case "SWITCH":
      return parseBoolean(value) ? (
        <TableTag color='success'>
          {field.attributes?.text_true ?? "Да"}
        </TableTag>
      ) : (
        <TableTag color='error'>
          {field.attributes?.text_false ?? "Нет"}
        </TableTag>
      );

    case "DYNAMIC":
      return computedInputString ?? "";

    case "FORMULA":
      return value ? numberWithSpaces(value) : "";

    case "FORMULA_FRONTEND":
      return value ? numberWithSpaces(value) : "";

    // case "FORMULA_FRONTEND":
    //   return <FormulaCell field={field} row={row} />

    case "ICO":
      return <IconGenerator icon={value} />;

    case "PHOTO":
      return (
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LogoDisplay url={value} />
        </span>
      );

    case "FILE":
      return value ? (
        <a
          href={value}
          className=''
          download
          target='_blank'
          onClick={(e) => e.stopPropagation()}
          rel='noreferrer'
        >
          <DownloadIcon
            style={{ width: "25px", height: "25px", fontSize: "30px" }}
          />
        </a>
      ) : (
        ""
      );

    default:
      if (typeof value === "object") return JSON.stringify(value);
      return value;
  }
};

export default CellElementGenerator;
