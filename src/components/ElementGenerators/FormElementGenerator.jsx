import { useEffect, useMemo } from "react";
import FRow from "../FormElements/FRow";
import HFAutocomplete from "../FormElements/HFAutocomplete";
import HFCheckbox from "../FormElements/HFCheckbox";
import HFDatePicker from "../FormElements/HFDatePicker";
import HFDateTimePicker from "../FormElements/HFDateTimePicker";
import HFFormulaField from "../FormElements/HFFormulaField";
import HFIconPicker from "../FormElements/HFIconPicker";
import HFImageUpload from "../FormElements/HFImageUpload";
import HFVideoUpload from "../FormElements/HFVideoUpload";
import HFFileUpload from "../FormElements/HFFileUpload";
import HFMultipleAutocomplete from "../FormElements/HFMultipleAutocomplete";
import HFNumberField from "../FormElements/HFNumberField";
import HFSwitch from "../FormElements/HFSwitch";
import HFTextEditor from "../FormElements/HFTextEditor";
import HFTextField from "../FormElements/HFTextField";
import HFTextFieldWithMask from "../FormElements/HFTextFieldWithMask";
import HFTimePicker from "../FormElements/HFTimePicker";
import HFDentist from "../FormElements/HFDentist";
import DynamicRelationFormElement from "./DynamicRelationFormElement";
import ManyToManyRelationFormElement from "./ManyToManyRelationFormElement";
import RelationFormElement from "./RelationFormElement";
import { Parser } from "hot-formula-parser";
import BarcodeGenerator from "./BarcodeGenerator";
import { useSelector } from "react-redux";
import CodabarBarcode from "./CodabarBarcode";
import HFSelectBySwitch from "../FormElements/HFSelectBySwitch";
// import DocumentGeneratorButton from "./components/DocumentGeneratorButton";

const parser = new Parser();

const FormElementGenerator = ({
  field = {},
  control,
  setFormValue,
  formTableSlug,
  fieldsList,
  multipleInsertField,
  ...props
}) => {
  const isUserId = useSelector((state) => state?.auth?.userId);
  const tables = useSelector((state) => state?.auth?.tables);
  let relationTableSlug = "";
  let objectIdFromJWT = "";
  if (field?.id?.includes("#")) {
    relationTableSlug = field?.id?.split("#")[0];
  }

  tables?.forEach((table) => {
    if (table?.table_slug === relationTableSlug) {
      objectIdFromJWT = table?.object_id;
    }
  });

  const computedSlug = useMemo(() => {
    if (field.id?.includes("@"))
      return `$${field?.id?.split("@")?.[0]}.${field?.slug}`;
    return field?.slug;
  }, [field?.id, field?.slug]);

  const defaultValue = useMemo(() => {
    if (field?.attributes?.object_id_from_jwt === true) return objectIdFromJWT;
    if (field?.attributes?.is_user_id_default === true) return isUserId;
    const defaultValue =
      field.attributes?.defaultValue ?? field.attributes?.default_values;
    if (!defaultValue) return undefined;
    if (field.relation_type === "Many2One") return defaultValue[0];
    if (field.type === "MULTISELECT" || field.id?.includes("#"))
      return defaultValue;
    const { error, result } = parser.parse(defaultValue);
    return error ? undefined : result;
  }, [field.attributes, field.type, field.id, field.relation_type]);

  const isDisabled = useMemo(() => {
    return (
      field.attributes?.disabled ||
      !field.attributes?.field_permission?.edit_permission
    );
  }, [field]);

  // if (!field.attributes?.field_permission?.view_permission) {
  //   return null
  // }

  if (field?.id?.includes("#")) {
    if (field?.relation_type === "Many2Many") {
      return (
        <ManyToManyRelationFormElement
          control={control}
          field={field}
          setFormValue={setFormValue}
          defaultValue={defaultValue}
          disabled={isDisabled}
          {...props}
        />
      );
    } else if (field?.relation_type === "Many2Dynamic") {
      return (
        <DynamicRelationFormElement
          control={control}
          field={field}
          setFormValue={setFormValue}
          defaultValue={defaultValue}
          disabled={isDisabled}
          {...props}
        />
      );
    } else {
      return (
        <RelationFormElement
          control={control}
          field={field}
          setFormValue={setFormValue}
          formTableSlug={formTableSlug}
          defaultValue={defaultValue}
          disabled={isDisabled}
          multipleInsertField={multipleInsertField}
          {...props}
        />
      );
    }
  }

  switch (field.type) {
    case "SINGLE_LINE":
      return (
        <FRow label={field.label} required={field.required}>
          <HFTextField
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            fullWidth
            required={field.required}
            placeholder={field.attributes?.placeholder}
            field={field}
            defaultValue={defaultValue}
            disabled={isDisabled}
            {...props}
          />
        </FRow>
      );

    case "PHONE":
      return (
        <FRow label={field.label} required={field.required}>
          <HFTextFieldWithMask
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            fullWidth
            required={field.required}
            placeholder={field.attributes?.placeholder}
            mask={"(99) 999-99-99"}
            defaultValue={defaultValue}
            disabled={isDisabled}
            field={field}
            {...props}
          />
        </FRow>
      );

    case "PICK_LIST":
      return (
        <FRow label={field.label} required={field.required}>
          <HFAutocomplete
            control={control}
            tabIndex={field?.tabIndex}
            name={computedSlug}
            width="100%"
            options={field?.attributes?.options}
            required={field.required}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            disabled={isDisabled}
            field={field}
            {...props}
          />
        </FRow>
      );

    case "MULTI_LINE":
      return (
        <FRow label={field.label} required={field.required}>
          <HFTextEditor
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            fullWidth
            multiline
            rows={4}
            required={field.required}
            placeholder={field.attributes?.placeholder}
            defaultValue={field.defaultValue}
            disabled={isDisabled}
            field={field}
            {...props}
          />
        </FRow>
      );

    case "DATE":
      return (
        <FRow label={field.label} required={field.required}>
          <HFDatePicker
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            fullWidth
            width={"100%"}
            mask={"99.99.9999"}
            required={field.required}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            disabled={isDisabled}
            {...props}
          />
        </FRow>
      );

    case "DATE_TIME":
      return (
        <FRow label={field.label} required={field.required}>
          <HFDateTimePicker
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            mask={"99.99.9999"}
            required={field.required}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            disabled={isDisabled}
            {...props}
          />
        </FRow>
      );

    case "TIME":
      return (
        <FRow label={field.label} required={field.required}>
          <HFTimePicker
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            required={field.required}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            disabled={isDisabled}
            {...props}
          />
        </FRow>
      );

    case "NUMBER":
      return (
        <FRow label={field.label} required={field.required}>
          <HFNumberField
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            fullWidth
            type="number"
            required={field.required}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            disabled={isDisabled}
            fields={field}
            {...props}
          />
        </FRow>
      );

    case "CHECKBOX":
      return (
        <HFCheckbox
          control={control}
          name={computedSlug}
          tabIndex={field?.tabIndex}
          label={field.label}
          required={field.required}
          defaultValue={defaultValue}
          disabled={isDisabled}
          {...props}
        />
      );

    case "MULTISELECT":
      return (
        <FRow label={field.label} required={field.required}>
          <HFMultipleAutocomplete
            control={control}
            name={computedSlug}
            width="100%"
            required={field.required}
            field={field}
            tabIndex={field?.tabIndex}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            disabled={isDisabled}
            {...props}
          />
        </FRow>
      );

    case "SWITCH":
      return (
        <HFSwitch
          control={control}
          name={computedSlug}
          label={field.label}
          tabIndex={field?.tabIndex}
          required={field.required}
          defaultValue={defaultValue}
          disabled={isDisabled}
          {...props}
        />
      );
    case "SELECT_BY_SWITCH":
      return (
        <HFSelectBySwitch
          control={control}
          name={computedSlug}
          field={field}
          tabIndex={field?.tabIndex}
          required={field.required}
          defaultValue={defaultValue}
          disabled={isDisabled}
          {...props}
        />
      );

    case "EMAIL":
      return (
        <FRow label={field.label} required={field.required}>
          <HFTextField
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
            tabIndex={field?.tabIndex}
            disabled={isDisabled}
            {...props}
          />
        </FRow>
      );

    case "PHOTO":
      return (
        <FRow label={field.label} required={field.required}>
          <HFImageUpload
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            required={field.required}
            defaultValue={defaultValue}
            disabled={isDisabled}
            {...props}
          />
        </FRow>
      );

    case "VIDEO":
      return (
        <FRow label={field.label} required={field.required}>
          <HFVideoUpload
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            required={field.required}
            defaultValue={defaultValue}
            disabled={isDisabled}
            {...props}
          />
        </FRow>
      );
    case "FILE":
      return (
        <FRow label={field.label} required={field.required}>
          <HFFileUpload
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            required={field.required}
            defaultValue={defaultValue}
            disabled={isDisabled}
            {...props}
          />
        </FRow>
      );

    case "BARCODE":
      return (
        <FRow label={field.label} required={field.required}>
          <BarcodeGenerator
            control={control}
            name={field.slug}
            tabIndex={field?.tabIndex}
            fullWidth
            required={field.required}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            field={field}
            // disabled={isDisabled}
            formTableSlug={formTableSlug}
            {...props}
          />
        </FRow>
      );

    case "CODABAR":
      return (
        <FRow label={field.label} required={field.required}>
          <CodabarBarcode
            control={control}
            name={field.slug}
            tabIndex={field?.tabIndex}
            fullWidth
            required={field.required}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            // disabled={isDisabled}
            formTableSlug={formTableSlug}
            {...props}
          />
        </FRow>
      );

    case "DENTIST":
      return (
        <FRow label={field.label} required={field.required}>
          <HFDentist
            control={control}
            name={computedSlug}
            fullWidth
            required={field.required}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            tabIndex={field?.tabIndex}
            disabled={isDisabled}
            field={field}
            {...props}
          />
        </FRow>
      );

    case "ICON":
      return (
        <FRow label={field.label} required={field.required}>
          <HFIconPicker
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            required={field.required}
            defaultValue={defaultValue}
            disabled={isDisabled}
            {...props}
          />
        </FRow>
      );

    case "FORMULA":
    case "INCREMENT_ID":
      return (
        <FRow label={field.label} required={field.required}>
          <HFTextField
            control={control}
            name={field.slug}
            tabIndex={field?.tabIndex}
            fullWidth
            required={field.required}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            InputProps={{
              readOnly: true,
              style: {
                background: "#c0c0c039",
              },
            }}
            {...props}
          />
        </FRow>
      );
    case "INCREMENT_NUMBER":
      return (
        <FRow label={field.label} required={field.required}>
          <HFTextField
            control={control}
            name={field.slug}
            tabIndex={field?.tabIndex}
            fullWidth
            required={field.required}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            InputProps={{
              readOnly: true,
              style: {
                background: "#c0c0c039",
              },
            }}
            {...props}
          />
        </FRow>
      );

    case "FORMULA_FRONTEND":
      return (
        <FRow label={field.label} required={field.required}>
          <HFFormulaField
            setFormValue={setFormValue}
            control={control}
            required={field.required}
            placeholder={field.attributes?.placeholder}
            name={field.slug}
            tabIndex={field?.tabIndex}
            fieldsList={fieldsList}
            field={field}
            defaultValue={defaultValue}
          />
        </FRow>
      );

    case "COLOR":
      return (
        <FRow label={field.label} required={field.required}>
          <HFTextField
            control={control}
            name={field.slug}
            tabIndex={field?.tabIndex}
            fullWidth
            required={field.required}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            type="color"
            disabled={isDisabled}
            {...props}
          />
        </FRow>
      );

    case "PASSWORD":
      return (
        <FRow label={field.label} required={field.required}>
          <HFTextField
            control={control}
            name={field.slug}
            tabIndex={field?.tabIndex}
            fullWidth
            required={field.required}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            disabled={field.attributes?.disabled}
            type="password"
            {...props}
          />
        </FRow>
      );

    default:
      return (
        <FRow label={field.label} required={field.required}>
          <HFTextField
            control={control}
            name={field.slug}
            tabIndex={field?.tabIndex}
            fullWidth
            required={field.required}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            disabled={isDisabled}
            type={field.type}
            {...props}
          />
        </FRow>
      );
  }
};

export default FormElementGenerator;
