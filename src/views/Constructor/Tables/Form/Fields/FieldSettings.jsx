import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useState } from "react";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import PrimaryButton from "../../../../../components/Buttons/PrimaryButton";
import FRow from "../../../../../components/FormElements/FRow";
import HFIconPicker from "../../../../../components/FormElements/HFIconPicker";
import HFSelect from "../../../../../components/FormElements/HFSelect";
import HFSwitch from "../../../../../components/FormElements/HFSwitch";
import HFTextField from "../../../../../components/FormElements/HFTextField";
import constructorFieldService from "../../../../../services/constructorFieldService";
import constructorObjectService from "../../../../../services/constructorObjectService";
import constructorRelationService from "../../../../../services/constructorRelationService";
import { fieldTypesOptions } from "../../../../../utils/constants/fieldTypes";
import { generateGUID } from "../../../../../utils/generateID";
import listToOptions from "../../../../../utils/listToOptions";
import Attributes from "./Attributes";
import DefaultValueBlock from "./Attributes/DefaultValueBlock";
import styles from "./style.module.scss";

const FieldSettings = ({
  closeSettingsBlock,
  mainForm,
  field,
  formType,
  height,
  onSubmit = () => {},
}) => {
  const { id, slug, appId } = useParams();
  const { handleSubmit, control, reset, watch } = useForm();
  const [formLoader, setFormLoader] = useState(false);

  const updateFieldInform = (field) => {
    const fields = mainForm.getValues("fields");
    const index = fields.findIndex((el) => el.id === field.id);

    mainForm.setValue(`fields[${index}]`, field);
    onSubmit(index, field);
  };

  const prepandFieldInForm = (field) => {
    const fields = mainForm.getValues("fields") ?? [];
    mainForm.setValue(`fields`, [field, ...fields]);
  };

  const showTooltip = useWatch({
    control,
    name: "attributes.showTooltip",
  });

  const createField = (field) => {
    const data = {
      ...field,
      id: generateGUID(),
    };

    if (!id) {
      prepandFieldInForm(data);
      closeSettingsBlock();
    } else {
      setFormLoader(true);
      constructorFieldService
        .create(data)
        .then((res) => {
          prepandFieldInForm(res);
          closeSettingsBlock(null);
        })
        .finally(() => setFormLoader(false));
    }
  };

  const updateField = (field) => {
    if (!id) {
      updateFieldInform(field);
      closeSettingsBlock();
    } else {
      setFormLoader(true);
      constructorFieldService
        .update(field)
        .then((res) => {
          updateFieldInform(field);
          closeSettingsBlock(null);
        })
        .finally(() => setFormLoader(false));
    }
  };

  const submitHandler = (values) => {
    if (formType === "CREATE") createField(values);
    else updateField(values);
  };

  const selectedAutofillTableSlug = useWatch({
    control,
    name: "autofill_table",
  });

  const layoutRelations = useWatch({
    control: mainForm.control,
    name: "layoutRelations",
  });


  const { data: fieldList } = useQuery(
    ["GET_FIELD_LIST", slug],
    () =>
    constructorObjectService.getList(slug, {
        data: {
          limit:0,
          offsett: 0,
          app_id: appId 
        }
      }),
    {
      select: (res) => {
        return (
          res?.data?.fields.map((item) => ({
            label: item?.label,
            value: item?.slug,
          })) ?? []
        );
      },
    }
  );

  const computedRelationTables = useMemo(() => {
    return layoutRelations?.map((table) => ({
      value: table.id?.split("#")?.[0],
      label: table.label,
    }));
  }, [layoutRelations]);
  const { data: computedRelationFields } = useQuery(
    ["GET_TABLE_FIELDS", selectedAutofillTableSlug],
    () => {
      if (!selectedAutofillTableSlug) return [];
      return constructorFieldService.getList({
        table_slug: selectedAutofillTableSlug,
        with_one_relation: true,
      });
    },
    {
      select: (res) =>
        [...res?.fields, ...res?.data?.one_relation_fields]
          ?.filter(
            (field) => field.type !== "LOOKUPS" && field?.type !== "LOOKUP"
          )
          .map((el) => ({
            value: el?.path_slug ? el?.path_slug : el?.slug,
            label: el?.label,
          })),
    }
  );

  useEffect(() => {
    const values = {
      attributes: {},
      default: "",
      index: "string",
      label: "",
      required: false,
      slug: "",
      table_id: id,
      type: "",
    };

    if (formType !== "CREATE") {
      reset({
        ...values,
        ...field,
      });
    } else {
      reset(values);
    }
  }, [field, formType, id, reset]);

  return (
    <div className={styles.settingsBlock}>
      <div className={styles.settingsBlockHeader}>
        <h2>{formType === "CREATE" ? "Create field" : "Edit field"}</h2>

        <IconButton onClick={closeSettingsBlock}>
          <Close />
        </IconButton>
      </div>

      <div className={styles.settingsBlockBody} style={{ height }}>
        <form
          onSubmit={handleSubmit(submitHandler)}
          className={styles.fieldSettingsForm}
        >
          <div className="p-2">
            <FRow label="Field Label and icon" required>
              <div className="flex align-center gap-1">
                <HFIconPicker
                  control={control}
                  name="attributes.icon"
                  shape="rectangle"
                />
                <HFTextField
                  disabledHelperText
                  fullWidth
                  name="label"
                  control={control}
                  placeholder="Field Label"
                  autoFocus
                  required
                />
              </div>
            </FRow>

            <FRow label="Field SLUG" required>
              <HFTextField
                disabledHelperText
                fullWidth
                name="slug"
                control={control}
                placeholder="Field SLUG"
                required
                withTrim
              />
            </FRow>

            <FRow label="Field type" required>
              <HFSelect
                disabledHelperText
                name="type"
                control={control}
                options={fieldTypesOptions}
                optionType="GROUP"
                placeholder="Type"
                required
              />
            </FRow>
          </div>

          <Attributes control={control} watch={watch} fieldList={fieldList} mainForm={mainForm} />

          <div className={styles.settingsBlockHeader}>
            <h2>Appearance</h2>
          </div>

          <div className="p-2">
            <FRow label="Placeholder">
              <HFTextField
                fullWidth
                name="attributes.placeholder"
                control={control}
              />
            </FRow>

            <DefaultValueBlock control={control} />

            <HFSwitch
              control={control}
              name="attributes.showTooltip"
              label="Show tooltip"
              className="mb-1"
            />

            {showTooltip && (
              <FRow label="Tooltip text">
                <HFTextField
                  fullWidth
                  name="attributes.tooltipText"
                  control={control}
                />
              </FRow>
            )}
          </div>

          <div className={styles.settingsBlockHeader}>
            <h2>Validation</h2>
          </div>

          <div className="p-2">
            <HFSwitch
              control={control}
              name="attributes.disabled"
              label="Disabled"
            />
            <HFSwitch control={control} name="required" label="Required" />
            <HFSwitch
              control={control}
              name="unique"
              label="Avoid duplicate values"
            />
            <HFSwitch
              control={control}
              name="attributes.creatable"
              label="Can create"
            />
          </div>

          <div className={styles.settingsBlockHeader}>
            <h2>Autofill settings</h2>
          </div>

          <div className="p-2">
            <FRow label="Autofill table">
              <HFSelect
                disabledHelperText
                name="autofill_table"
                control={control}
                options={computedRelationTables}
                placeholder="Type"
              />
            </FRow>

            <FRow label="Autofill field">
              <HFSelect
                disabledHelperText
                name="autofill_field"
                control={control}
                options={computedRelationFields}
                placeholder="Type"
              />
            </FRow>
            <FRow label="Automatic">
              <HFSwitch control={control} name="automatic" label="automatic" />
            </FRow>
          </div>
        </form>

        <div className={styles.settingsFooter}>
          <PrimaryButton
            size="large"
            className={styles.button}
            style={{ width: "100%" }}
            onClick={handleSubmit(submitHandler)}
            loader={formLoader}
          >
            Сохранить
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default FieldSettings;
