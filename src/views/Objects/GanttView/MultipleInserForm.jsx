import { Close } from "@mui/icons-material";
import { CircularProgress, Divider, IconButton } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import FormElementGenerator from "../../../components/ElementGenerators/FormElementGenerator";
import HFMultipleCalendar from "../../../components/FormElements/HFMultipleCalendar";
import RingLoaderWithWrapper from "../../../components/Loaders/RingLoader/RingLoaderWithWrapper";
import constructorObjectService from "../../../services/constructorObjectService";
import constructorSectionService from "../../../services/constructorSectionService";
import { sortSections } from "../../../utils/sectionsOrderNumber";
import styles from "./style.module.scss";

const MultipleInserForm = ({ view, setView, drawerState, onClose, tab }) => {
  const { tableSlug } = useParams();
  const [btnLoader, setBtnLoader] = useState(false);
  const queryClient = useQueryClient();

  const { isLoading, data: sections = [] } = useQuery(
    ["GET_SECTIONS", tableSlug],
    () => {
      return constructorSectionService.getList({
        table_slug: tableSlug,
      });
    },
    {
      select: ({ sections }) => sortSections(sections),
    }
  );

  const { handleSubmit, control } = useForm({
    defaultValues: drawerState,
  });

  const onSubmit = async (values) => {
    setBtnLoader(true);

    try {
      const computedData = values?.multiple_dates?.map((date) => ({
        ...values,
        [view.calendar_from_slug]: date,
      }));

      const updatedFields = [tab.slug, view.calendar_from_slug];

      const data = {
        data: { objects: computedData },
        updated_fields: updatedFields,
      };

      await constructorObjectService.updateMultiple(tableSlug, data);

      onClose();

      queryClient.refetchQueries([
        "GET_OBJECTS_LIST_WITH_RELATIONS",
        { tableSlug },
      ]);
    } catch (error) {
      setBtnLoader(false);
    }
  };

  return (
    <>
      <div className={styles.header}>
        <h2 className={styles.title}>Расписание</h2>

        <IconButton className={styles.closeButton} onClick={onClose}>
          <Close className={styles.closeIcon} />
        </IconButton>
      </div>
      <div className={styles.body}>
        {isLoading ? (
          <RingLoaderWithWrapper />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <HFMultipleCalendar control={control} name="multiple_dates" />

            <Divider className="my-2" />

            {sections?.map((section) => (
              <div>
                {section.fields
                  ?.filter((el) => el.slug !== view.calendar_from_slug)
                  .map((field) => (
                    <FormElementGenerator field={field} control={control} />
                  ))}
              </div>
            ))}
          </form>
        )}
      </div>

      <div className={styles.footer}>
        <PrimaryButton
          size="large"
          className={styles.button}
          onClick={handleSubmit(onSubmit)}
          loader={btnLoader}
        >
          Сохранить
        </PrimaryButton>
      </div>
    </>
  );
};

export default MultipleInserForm;
