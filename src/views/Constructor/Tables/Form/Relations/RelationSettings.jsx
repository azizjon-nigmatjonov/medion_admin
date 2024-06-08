import {
  Close,
  DragIndicator,
  PushPin,
  PushPinOutlined,
  RemoveRedEye,
  VisibilityOff,
} from "@mui/icons-material";
import { Checkbox, IconButton } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Container, Draggable } from "react-smooth-dnd";
import PrimaryButton from "../../../../../components/Buttons/PrimaryButton";
import FRow from "../../../../../components/FormElements/FRow";
import HFCheckbox from "../../../../../components/FormElements/HFCheckbox";
import HFMultipleSelect from "../../../../../components/FormElements/HFMultipleSelect";
import HFSelect from "../../../../../components/FormElements/HFSelect";
import HFSwitch from "../../../../../components/FormElements/HFSwitch";
import HFTextField from "../../../../../components/FormElements/HFTextField";
import RingLoaderWithWrapper from "../../../../../components/Loaders/RingLoader/RingLoaderWithWrapper";
import applicationService from "../../../../../services/applicationSercixe";
import constructorObjectService from "../../../../../services/constructorObjectService";
import constructorRelationService from "../../../../../services/constructorRelationService";
import { applyDrag } from "../../../../../utils/applyDrag";
import { relationTyes } from "../../../../../utils/constants/relationTypes";
import AutoFiltersBlock from "./AutoFiltersBlock";
import DefaultValueBlock from "./DefaultValueBlock";
import DynamicRelationsBlock from "./DynamicRelationsBlock";
import CascadingRelationSettings from "./CascadingRelationSettings.jsx";
import CascadingTreeBlock from "./CascadingTreeBlock";
import styles from "./style.module.scss";
import SummaryBlock from "./SummaryBlock";
import { useSelector } from "react-redux";
import MultipleInsertSettings from "@/views/Objects/components/ViewSettings/MultipleInsertSettings";
import multipleInsertForm from "@/views/Objects/components/MultipleInsertForm";
import listToOptions from "@/utils/listToOptions";
import TableActions from "../Actions/TableActions";

const relationViewTypes = [
  {
    label: "Table",
    value: "TABLE",
  },
  {
    label: "Input",
    value: "INPUT",
  },
];

const RelationSettings = ({
  closeSettingsBlock = () => {},
  relation,
  getRelationFields,
  formType,
  height,
}) => {
  const { appId, slug } = useParams();
  const [loader, setLoader] = useState(false);
  const [formLoader, setFormLoader] = useState(false);
  const form = useForm();
  const [onlyCheckedColumnsVisible, setOnlyCheckedColumnsVisible] =
    useState(true);
  const [onlyCheckedFiltersVisible, setOnlyCheckedFiltersVisible] =
    useState(true);

  const { handleSubmit, control, reset, watch, setValue } = useForm({
    defaultValues: {
      table_from: slug,
      auto_filters: [],
      action_relations: [],
    },
  });
  const values = watch();
  const relatedTableSlug = useMemo(() => {
    if (values.type === "Recursive") return values.table_from;
    if (values.table_to === slug) return values.table_from;
    else if (values.table_from === slug) return values.table_to;
    return null;
  }, [values, slug]);

  const isViewFieldsVisible = useMemo(() => {
    return (
      (values.type === "Many2One" && values.table_from === slug) ||
      values.type === "Many2Many" ||
      values.type === "Recursive"
    );
  }, [values.type, values.table_from, slug]);

  const computedColumnsList = useMemo(() => {
    if (onlyCheckedColumnsVisible) return values.columnsList;
    else return values.columnsList?.filter((column) => column.is_checked);
  }, [values.columnsList, onlyCheckedColumnsVisible]);

  const computedFiltersList = useMemo(() => {
    if (!onlyCheckedFiltersVisible) return values.filtersList;
    else return values.filtersList?.filter((column) => column.is_checked);
  }, [values.filtersList, onlyCheckedFiltersVisible]);

  const { isLoading: fieldsLoading } = useQuery(
    ["GET_VIEWS_AND_FIELDS", relatedTableSlug],
    () => {
      if (!relatedTableSlug) return [];
      return constructorObjectService.getList(relatedTableSlug, {
        data: { limit: 0, offset: 0 },
      });
    },
    {
      cacheTime: 10,
      onSuccess: ({ data }) => {
        if (!data) return;

        const fields = data?.fields ?? [];

        const checkedColumns =
          values.columns
            ?.map((id) => {
              const field = fields.find((field) => field.id === id);
              if (field)
                return {
                  ...field,
                  is_checked: true,
                };
              return null;
            })
            .filter((field) => field) ?? [];
        const unCheckedColumns = fields.filter(
          (field) => !values.columns?.includes(field.id)
        );

        const checkedFilters =
          values.quick_filters
            ?.map((filter) => {
              const field = fields.find(
                (field) => field.id === filter.field_id
              );
              if (field)
                return {
                  ...field,
                  is_checked: true,
                };
              return null;
            })
            .filter((field) => field) ?? [];

        const unCheckedFilters = fields.filter(
          (field) =>
            !values.quick_filters?.some(
              (filter) => filter.field_id === field.id
            )
        );
        setValue("filtersList", [...checkedFilters, ...unCheckedFilters]);
        setValue("columnsList", [...checkedColumns, ...unCheckedColumns]);
      },
    }
  );

  const computedFieldsListOptions = useMemo(() => {
    return values.columnsList?.map((field) => ({
      label: field.label,
      value: field.id,
    }));
  }, [values.columnsList]);

  const { data: app } = useQuery(["GET_TABLE_LIST", appId], () => {
    return applicationService.getById(appId);
  });

  const computedTablesList = useMemo(() => {
    return app?.tables?.map((table) => ({
      value: table.slug,
      label: table.label,
    }));
  }, [app]);

  const isRecursiveRelation = useMemo(() => {
    return values.type === "Recursive";
  }, [values.type]);

  const computedRelationsTypesList = useMemo(() => {
    return relationTyes.map((type) => ({
      value: type,
      label: type,
    }));
  }, []);

  const updateRelations = async () => {
    setLoader(true);

    await getRelationFields();

    closeSettingsBlock(null);
    setLoader(false);
  };

  const onColumnsPositionChange = (dragResult) => {
    const result = applyDrag(values.columnsList, dragResult);
    if (result) setValue("columnsList", result);
  };

  const onFilterPositionChange = (dragResult) => {
    const result = applyDrag(values.filtersList, dragResult);
    if (result) setValue("filtersList", result);
  };

  const submitHandler = (values) => {
    const data = {
      ...values,
      relation_table_slug: slug,
      // compute columns
      columns: values.columnsList
        ?.filter((el) => el.is_checked)
        ?.map((el) => el.id),

      // compute filters
      quick_filters: values.filtersList
        ?.filter((el) => el.is_checked)
        ?.map((el) => ({
          field_id: el.id,
          default_value: "",
        })),

      // compute default value
      default_values: values?.default_values
        ? Array.isArray(values.default_values)
          ? values.default_values
          : [values.default_values]
        : [],
    };

    delete data?.field_name;
    delete data?.formula_name;

    setFormLoader(true);

    if (formType === "CREATE") {
      constructorRelationService
        .create(data)
        .then((res) => {
          updateRelations();
        })
        .finally(() => setFormLoader(false));
    } else {
      constructorRelationService
        .update(data)
        .then((res) => {
          updateRelations();
        })
        .finally(() => setFormLoader(false));
    }
  };

  useEffect(() => {
    if (formType === "CREATE") return;
    reset({
      ...relation,
      table_from: relation?.table_from?.slug ?? "",
      table_to: relation?.table_to?.slug ?? "",
      type: relation?.type ?? "",
      id: relation?.id ?? "",
      editable: relation?.editable ?? false,
      summaries: relation?.summaries ?? [],
      view_fields: relation?.view_fields?.map((field) => field.id) ?? [],
    });
  }, [relation]);

  const computedColumns = useMemo(() => {
    return listToOptions(computedColumnsList, "label", "slug");
  }, [computedColumnsList]);

  return (
    <div className={styles.settingsBlock}>
      <div className={styles.settingsBlockHeader}>
        <h2>{formType === "CREATE" ? "Create" : "Edit"} relation</h2>

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
            <FRow label="Label" required>
              <HFTextField
                name="title"
                control={control}
                placeholder="Relation Label"
                fullWidth
                required
              />
            </FRow>

            <FRow label="Table from" required>
              <HFSelect
                name="table_from"
                control={control}
                placeholder="Table from"
                options={computedTablesList}
                autoFocus
                required
              />
            </FRow>

            {!isRecursiveRelation && values.type !== "Many2Dynamic" && (
              <FRow label="Table to" required>
                <HFSelect
                  name="table_to"
                  control={control}
                  placeholder="Table to"
                  options={computedTablesList}
                  required
                />
              </FRow>
            )}

            <FRow label="Relation type" required>
              <HFSelect
                name="type"
                control={control}
                placeholder="Relation type"
                options={computedRelationsTypesList}
                required
              />
            </FRow>

            <HFSwitch control={control} name="is_editable" label={"Editable"} />

            {values.type === "Many2Many" && (
              <FRow label="Relate field type" required>
                <HFSelect
                  name="view_type"
                  control={control}
                  placeholder="Relation field type"
                  options={relationViewTypes}
                />
              </FRow>
            )}

            {isViewFieldsVisible && (
              <FRow label="View fields">
                <HFMultipleSelect
                  name="view_fields"
                  control={control}
                  options={computedFieldsListOptions}
                  placeholder="View fields"
                  allowClear
                />
              </FRow>
            )}
          </div>

          {values.type === "Many2Dynamic" && (
            <DynamicRelationsBlock
              control={control}
              computedTablesList={computedTablesList}
            />
          )}

          <DefaultValueBlock
            control={control}
            watch={watch}
            columnsList={values.columnsList}
          />

          <AutoFiltersBlock control={control} watch={watch} />
          <CascadingRelationSettings
            slug={relation?.table_to?.slug}
            field_slug={relation?.field_from}
            control={control}
            watch={watch}
            setValue={setValue}
          />
          <CascadingTreeBlock
            slug={relation?.table_to?.slug}
            field_slug={relation?.field_from}
            control={control}
            watch={watch}
            setValue={setValue}
          />
          <SummaryBlock
            control={control}
            computedFieldsListOptions={computedFieldsListOptions}
          />

          <div className={styles.settingsBlockHeader}>
            <h2>Columns</h2>

            <Checkbox
              icon={<VisibilityOff />}
              checkedIcon={<RemoveRedEye />}
              checked={onlyCheckedColumnsVisible}
              onChange={(e, val) => setOnlyCheckedColumnsVisible(val)}
            />
          </div>

          {fieldsLoading ? (
            <RingLoaderWithWrapper />
          ) : (
            <Container lockAxis="y" onDrop={onColumnsPositionChange}>
              {computedColumnsList?.map((field, index) => (
                <Draggable key={field.id}>
                  <div className={styles.draggableRow}>
                    <IconButton className={styles.dragButton}>
                      <DragIndicator />
                    </IconButton>
                    <p className={styles.label}>{field.label}</p>

                    <HFCheckbox
                      control={control}
                      name={`columnsList[${index}].is_checked`}
                      icon={<VisibilityOff />}
                      checkedIcon={<RemoveRedEye />}
                    />
                  </div>
                </Draggable>
              ))}
            </Container>
          )}

          {/* <TableActions control={control} watch={watch} setValue={setValue} /> */}

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitle}>Multiple insert</div>
              <HFSwitch control={control} name="multiple_insert" />
            </div>

            {watch().multiple_insert && (
              <div className={styles.sectionBody}>
                <div className={styles.formRow}>
                  <FRow label="Multiple insert field">
                    <HFSelect
                      options={computedColumns}
                      control={control}
                      name="multiple_insert_field"
                    />
                  </FRow>

                  <FRow label="Fixed fields">
                    <HFMultipleSelect
                      options={computedColumns}
                      control={control}
                      name="updated_fields"
                    />
                  </FRow>
                </div>
              </div>
            )}
          </div>

          <div className={styles.settingsDefaultLimit}>
            <h2>Default limit</h2>
            <div className={styles.default_limit}>
              <HFTextField control={control} name="default_limit" fullWidth />
            </div>
          </div>

          <div className={styles.settingsBlockHeader}>
            <h2>Filters</h2>

            <Checkbox
              icon={<PushPinOutlined style={{ transform: "rotate(45deg)" }} />}
              checkedIcon={<PushPin />}
              checked={onlyCheckedFiltersVisible}
              onChange={(e, val) => setOnlyCheckedFiltersVisible(val)}
            />
          </div>

          {fieldsLoading ? (
            <RingLoaderWithWrapper />
          ) : (
            <Container lockAxis="y" onDrop={onFilterPositionChange}>
              {computedFiltersList?.map((field, index) => (
                <Draggable key={field.id}>
                  <div className={styles.draggableRow}>
                    <IconButton className={styles.dragButton}>
                      <DragIndicator />
                    </IconButton>

                    <p className={styles.label}>{field.label}</p>

                    <HFCheckbox
                      control={control}
                      name={`filtersList[${index}].is_checked`}
                      icon={
                        <PushPinOutlined
                          style={{ transform: "rotate(45deg)" }}
                        />
                      }
                      checkedIcon={<PushPin />}
                    />
                  </div>
                </Draggable>
              ))}
            </Container>
          )}

          {/* <div className={styles.summary}>
            <div style={{ padding: "8px 16px" }} className={styles.summaryTop}>
              <div>Summary</div>
              <HFCheckbox
                control={control}
                name="editable"
                // value={values?.editable}
              />
            </div>
          </div> */}

          <div className={styles.settingsFooter}>
            <PrimaryButton
              size="large"
              className={styles.button}
              style={{ width: "100%" }}
              onClick={handleSubmit(submitHandler)}
              loader={formLoader || loader}
            >
              Сохранить
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RelationSettings;
