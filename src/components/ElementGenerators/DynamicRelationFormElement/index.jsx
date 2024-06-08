import {
  CircularProgress,
  InputAdornment,
  Menu,
  TextField,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import FRow from "../../FormElements/FRow";
import styles from "./style.module.scss";
import { useController } from "react-hook-form";
import Dropdown from "./Dropdown";
import { useMemo } from "react";
import { useEffect } from "react";
import constructorObjectService from "../../../services/constructorObjectService";
import { getLabelWithViewFields } from "../../../utils/getRelationFieldLabel";
import FEditableRow from "../../FormElements/FEditableRow";

const DynamicRelationFormElement = ({
  control,
  field,
  setFormValue,
  disabled = false,
}) => {
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    name: field?.attributes?.relation_field_slug ?? field?.relation_field_slug,
    control,
    defaultValue: null,
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const [localValue, setLocalValue] = useState(null);
  const [inputLoader, setInputLoader] = useState(false);

  const tablesList = useMemo(() => {
    return (
      field.attributes?.dynamic_tables?.map((el) => {
        return el.table ? { ...el.table, ...el } : el;
      }) ?? []
    );
  }, [field.attributes?.dynamic_tables]);

  const tableInValue = useMemo(() => {
    return tablesList?.find((table) => value?.[`${table.slug}_id`]) ?? "";
  }, [tablesList, value]);

  const onObjectSelect = (object, selectedTable) => {
    const data = {
      [`${selectedTable.slug}_id`]: object.value,
    };
    setLocalValue(object);
    onChange(data);
    closeMenu();
  };
  const getValueData = async () => {
    try {
      setInputLoader(true);
      const id = value?.[`${tableInValue.slug}_id`];
      const res = await constructorObjectService.getById(tableInValue.slug, id);
      const data = res?.data?.response;

      setLocalValue(
        data
          ? {
              value: data.id,
              label: getLabelWithViewFields(tableInValue.view_fields, data),
            }
          : null
      );
    } finally {
      setInputLoader(false);
    }
  };

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (tableInValue) {
      getValueData();
    }
  }, []);

  const computedInputString = useMemo(() => {
    if (!tableInValue || !localValue) return "";
    return `${tableInValue.label} / ${localValue.label}`;
  }, [tableInValue, localValue]);

  return (
    <>
      <FEditableRow
        label={field.label ?? field.title}
        onLabelChange={onChange}
        required={field.required}
      >
        {/* <FRow label={field.label ?? field.title} required={field.required}> */}
        <Tooltip title={field?.attributes?.showTooltip && field?.attributes?.tooltipText}>
        <TextField
          disabled={disabled}
          size="small"
          fullWidth
          onClick={openMenu}
          value={computedInputString}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment>
                {inputLoader && <CircularProgress size={14} />}
              </InputAdornment>
            ),
          }}
        />
        </Tooltip>
        {/* </FRow> */}
      </FEditableRow>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={closeMenu}
        classes={{ list: styles.menu, paper: styles.paper }}
      >
        <Dropdown
          field={field}
          closeMenu={closeMenu}
          onObjectSelect={onObjectSelect}
          tablesList={tablesList}
        />
      </Menu>
    </>
  );
};

export default DynamicRelationFormElement;
