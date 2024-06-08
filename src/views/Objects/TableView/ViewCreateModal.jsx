import { Divider } from "@mui/material";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import FRow from "../../../components/FormElements/FRow";
import HFMultipleSelect from "../../../components/FormElements/HFMultipleSelect";
import HFSelect from "../../../components/FormElements/HFSelect";
import ModalCard from "../../../components/ModalCard";
import constructorFieldService from "../../../services/constructorFieldService";
import constructorTableService from "../../../services/constructorTableService";
import constructorViewService from "../../../services/constructorViewService";
import { arrayToOptions } from "../../../utils/arrayToOptions";
import { viewTypes } from "../../../utils/constants/viewTypes";
import listToOptions from "../../../utils/listToOptions";

const ViewCreateModal = ({
  tableSlug,
  fields = [],
  closeModal,
  initialValues = {},
  setViews,
}) => {
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      group_fields: [
        {
          field_slug: "",
          field_type: "start_timestamp",
        },
        {
          field_slug: "",
          field_type: "end_timestamp",
        },
      ],
      main_field: "",
      table_slug: tableSlug,
      type: "",
      view_fields: [],
      disable_dates: {
        day_slug: "",
        table_slug: "",
        time_from_slug: "",
        time_to_slug: "",
      },
    },
  });

  const type = watch("type");
  const selectedDisableDatesTableSlug = watch("disable_dates.table_slug");

  const computedViewTypes = useMemo(() => {
    return arrayToOptions(viewTypes);
  }, []);

  const computedFields = useMemo(() => {
    const newFields = fields?.map((field) => {
      let slug = field.slug;

      if (field.id.includes("#")) {
        const tableSlug = field.id.split("#")[0];
        const viewFields =
          field.attributes?.map(
            (viewField) => `${tableSlug}.${viewField.slug}`
          ) ?? [];

        slug = viewFields.join("#");
      }
      return { ...field, slug };
    });

    return listToOptions(newFields, "label", "slug");
  }, [fields]);

  const { data: tablesList = [] } = useQuery(
    ["GET_TABLES_LIST"],
    () => {
      return constructorTableService.getList();
    },
    {
      select: (data) => listToOptions(data?.tables, "label", "slug"),
    }
  );


  const { data: disabledDateFieldsList = [] } = useQuery(
    ["GET_TABLE_FIELDS", selectedDisableDatesTableSlug],
    () => {
      if (!selectedDisableDatesTableSlug) return [];
      return constructorFieldService.getList({
        table_slug: selectedDisableDatesTableSlug,
      });
    },
    {
      select: ({ fields }) =>
        listToOptions(
          fields?.filter((field) => field.type !== "LOOKUP"),
          "label",
          "slug"
        ),
    }
  );
  const submitHandler = async (values) => {
    try {
      let res;

      if (initialValues.id) {
        res = await constructorViewService.update(values);
      } else {
        res = await constructorViewService.create(values);

        setViews((prev) => [...prev, res]);
      }

      closeModal();
    } catch (error) {}
  };

  return (
    <ModalCard
      title="Create view"
      onClose={closeModal}
      onSaveButtonClick={handleSubmit(submitHandler)}
    >
      <form>
        <FRow label="View type">
          <HFSelect
            autoFocus
            fullWidth
            options={computedViewTypes}
            control={control}
            name="type"
          />
        </FRow>

        <FRow label="Main field">
          <HFSelect
            fullWidth
            options={computedFields}
            control={control}
            name="main_field"
          />
        </FRow>

        {type === "CALENDAR" && (
          <>
            <FRow label="Start timestamp">
              <HFSelect
                fullWidth
                options={computedFields}
                control={control}
                name="group_fields[0].field_slug"
              />
            </FRow>
            <FRow label="End timestamp">
              <HFSelect
                fullWidth
                options={computedFields}
                control={control}
                name="group_fields[1].field_slug"
              />
            </FRow>
            <FRow label="View fields">
              <HFMultipleSelect
                fullWidth
                options={computedFields}
                control={control}
                name="view_fields"
              />
            </FRow>

            {/* ============== DISABLES DATES =============== */}

            <Divider className="my-2" />

            <h3>Enabled dates</h3>

            <Divider className="my-1" />

            <FRow label="Table">
              <HFSelect
                fullWidth
                options={tablesList}
                control={control}
                name="disable_dates.table_slug"
              />
            </FRow>

            <FRow label="Week day field">
              <HFSelect
                fullWidth
                options={disabledDateFieldsList}
                control={control}
                name="disable_dates.day_slug"
              />
            </FRow>

            <FRow label="Start time field">
              <HFSelect
                fullWidth
                options={disabledDateFieldsList}
                control={control}
                name="disable_dates.time_from_slug"
              />
            </FRow>

            <FRow label="End time field">
              <HFSelect
                fullWidth
                options={disabledDateFieldsList}
                control={control}
                name="disable_dates.time_to_slug"
              />
            </FRow>
          </>
        )}
      </form>
    </ModalCard>
  );
};

export default ViewCreateModal;
