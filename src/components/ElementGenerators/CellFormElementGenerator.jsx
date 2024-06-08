import { Parser } from "hot-formula-parser";
import { useEffect, useMemo } from "react";
import { useWatch } from "react-hook-form";
import { useSelector } from "react-redux";
import CHFFormulaField from "../FormElements/CHFFormulaField";
import HFAutocomplete from "../FormElements/HFAutocomplete";
import HFCheckbox from "../FormElements/HFCheckbox";
import HFDatePicker from "../FormElements/HFDatePicker";
import HFDateTimePicker from "../FormElements/HFDateTimePicker";
import HFFormulaField from "../FormElements/HFFormulaField";
import HFIconPicker from "../FormElements/HFIconPicker";
import HFMultipleAutocomplete from "../FormElements/HFMultipleAutocomplete";
import HFNumberField from "../FormElements/HFNumberField";
import HFSwitch from "../FormElements/HFSwitch";
import HFTextField from "../FormElements/HFTextField";
import HFTextFieldWithMask from "../FormElements/HFTextFieldWithMask";
import HFTimePicker from "../FormElements/HFTimePicker";
import CellElementGenerator from "./CellElementGenerator";
import CellManyToManyRelationElement from "./CellManyToManyRelationElement";
import CellRelationFormElement from "./CellRelationFormElement";

const parser = new Parser();

const CellFormElementGenerator = ({
  field,
  fields,
  isBlackBg = false,
  watch,
  columns = [],
  row,
  control,
  setFormValue,
  shouldWork = false,
  index,
  relationfields,
  ...props
}) => {
  const selectedRow = useSelector((state) => state.selectedRow.selected);
  const userId = useSelector((state) => state.auth.userId);
  const tables = useSelector((state) => state.auth.tables);
  let relationTableSlug = "";
  let objectIdFromJWT = "";

  if (field?.id.includes("#")) {
    relationTableSlug = field?.id.split("#")[0];
  }

  tables?.forEach((table) => {
    if (table.table_slug === relationTableSlug) {
      objectIdFromJWT = table.object_id;
    }
  });

  const computedSlug = useMemo(
    () => `multi.${index}.${field.slug}`,
    [field.slug, index]
  );

  const changedValue = useWatch({
    control,
    name: computedSlug,
  });

  const isDisabled = useMemo(() => {
    return (
      field.attributes?.disabled ||
      !field.attributes?.field_permission?.edit_permission
    );
  }, [field]);

  const defaultValue = useMemo(() => {
    const defaultValue =
      field.attributes?.defaultValue ?? field.attributes?.default_values;
    if (!defaultValue) return undefined;
    if (field?.attributes?.is_user_id_default === true) return userId;
    if (field?.attributes?.object_id_from_jwt === true) return objectIdFromJWT;
    if (field.relation_type === "Many2One") return defaultValue[0];
    if (field.type === "MULTISELECT" || field.id?.includes("#"))
      return defaultValue;
    const { error, result } = parser.parse(defaultValue);
    return error ? undefined : result;
  }, [field.attributes, field.type, field.id, field.relation_type]);

  useEffect(() => {
    if (!row?.[field.slug]) {
      setFormValue(computedSlug, row?.[field.table_slug]?.guid || defaultValue);
    }
  }, [field, row, setFormValue, computedSlug]);

  useEffect(() => {
    if (columns.length && changedValue !== undefined && changedValue !== null) {
      columns.forEach(
        (i, rowIndex) =>
          selectedRow.includes(i.guid) &&
          setFormValue(`multi.${rowIndex}.${field.slug}`, changedValue)
      );
    }
  }, [changedValue, setFormValue, columns, field, selectedRow]);

  switch (field.type) {
    case "LOOKUP":
      return (
        <CellRelationFormElement
          disabled={isDisabled}
          isFormEdit
          isBlackBg={isBlackBg}
          control={control}
          name={computedSlug}
          field={field}
          row={row}
          placeholder={field.attributes?.placeholder}
          setFormValue={setFormValue}
          index={index}
          defaultValue={defaultValue}
          relationfields={relationfields}
        />
      );

    case "LOOKUPS":
      return (
        <CellManyToManyRelationElement
          disabled={isDisabled}
          isFormEdit
          isBlackBg={isBlackBg}
          control={control}
          name={computedSlug}
          field={field}
          row={row}
          placeholder={field.attributes?.placeholder}
          setFormValue={setFormValue}
          index={index}
          defaultValue={defaultValue}
        />
      );

    case "SINGLE_LINE":
      return (
        <HFTextField
          disabled={isDisabled}
          isFormEdit
          isBlackBg={isBlackBg}
          control={control}
          name={computedSlug}
          fullWidth
          required={field.required}
          placeholder={field.attributes?.placeholder}
          {...props}
          defaultValue={defaultValue}
        />
      );

    case "PHONE":
      return (
        <HFTextFieldWithMask
          disabled={isDisabled}
          isFormEdit
          isBlackBg={isBlackBg}
          control={control}
          name={computedSlug}
          fullWidth
          required={field.required}
          placeholder={field.attributes?.placeholder}
          mask={"(99) 999-99-99"}
          defaultValue={defaultValue}
          {...props}
        />
      );

    case "FORMULA":
      return (
        <HFFormulaField
          disabled={isDisabled}
          isFormEdit
          isBlackBg={isBlackBg}
          control={control}
          name={computedSlug}
          fullWidth
          required={field.required}
          placeholder={field.attributes?.placeholder}
          mask={"(99) 999-99-99"}
          defaultValue={defaultValue}
          {...props}
        />
      );
    case "FORMULA_FRONTEND":
      return (
        <CHFFormulaField
          setFormValue={setFormValue}
          control={control}
          required={field.required}
          placeholder={field.attributes?.placeholder}
          name={computedSlug}
          fieldsList={fields}
          disabled={!isDisabled}
          field={field}
          index={index}
          {...props}
          defaultValue={defaultValue}
        />
      );

    case "PICK_LIST":
      return (
        <HFAutocomplete
          disabled={isDisabled}
          isBlackBg={isBlackBg}
          isFormEdit
          control={control}
          name={computedSlug}
          width="100%"
          options={field?.attributes?.options}
          required={field.required}
          placeholder={field.attributes?.placeholder}
          defaultValue={defaultValue}
          {...props}
        />
      );

    case "MULTISELECT":
      return (
        <HFMultipleAutocomplete
          disabled={isDisabled}
          isFormEdit
          control={control}
          name={computedSlug}
          width="100%"
          required={field.required}
          field={field}
          placeholder={field.attributes?.placeholder}
          isBlackBg={isBlackBg}
          defaultValue={defaultValue}
          {...props}
        />
      );

    case "DATE":
      return (
        <HFDatePicker
          control={control}
          name={computedSlug}
          fullWidth
          width={"100%"}
          mask={"99.99.9999"}
          isFormEdit
          isBlackBg={isBlackBg}
          required={field.required}
          placeholder={field.attributes?.placeholder}
          defaultValue={defaultValue}
          disabled={isDisabled}
          {...props}
        />
      );

    case "DATE_TIME":
      return (
        <HFDateTimePicker
          disabled={isDisabled}
          isFormEdit
          isBlackBg={isBlackBg}
          showCopyBtn={false}
          control={control}
          name={computedSlug}
          required={field.required}
          placeholder={field.attributes?.placeholder}
          defaultValue={defaultValue}
          {...props}
        />
      );

    case "TIME":
      return (
        <HFTimePicker
          disabled={isDisabled}
          isFormEdit
          isBlackBg={isBlackBg}
          control={control}
          name={computedSlug}
          required={field.required}
          placeholder={field.attributes?.placeholder}
          defaultValue={defaultValue}
          {...props}
        />
      );

    case "NUMBER":
      return (
        <HFNumberField
          disabled={isDisabled}
          isFormEdit
          control={control}
          name={computedSlug}
          fullWidth
          required={field.required}
          placeholder={field.attributes?.placeholder}
          isBlackBg={isBlackBg}
          defaultValue={defaultValue}
          {...props}
        />
      );

    case "CHECKBOX":
      return (
        <HFCheckbox
          disabled={isDisabled}
          isFormEdit
          isBlackBg={isBlackBg}
          control={control}
          name={computedSlug}
          required={field.required}
          defaultValue={defaultValue}
          {...props}
        />
      );

    case "SWITCH":
      return (
        <HFSwitch
          disabled={isDisabled}
          isFormEdit
          isBlackBg={isBlackBg}
          control={control}
          name={computedSlug}
          required={field.required}
          defaultValue={defaultValue}
          {...props}
        />
      );

    case "EMAIL":
      return (
        <HFTextField
          disabled={isDisabled}
          isFormEdit
          isBlackBg={isBlackBg}
          control={control}
          name={computedSlug}
          rules={{
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Incorrect email format",
            },
          }}
          fullWidth
          required={field.required}
          placeholder={field.attributes?.placeholder}
          defaultValue={defaultValue}
          {...props}
        />
      );

    case "ICON":
      return (
        <HFIconPicker
          isFormEdit
          control={control}
          name={computedSlug}
          required={field.required}
          defaultValue={defaultValue}
          {...props}
        />
      );

    default:
      return (
        <div style={{ padding: "0 4px" }}>
          <CellElementGenerator field={field} row={row} />
        </div>
      );
  }
};

export default CellFormElementGenerator;
