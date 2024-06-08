import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Add } from "@mui/icons-material";

import cls from "../styles.module.scss";
import SecondaryButton from "../../../../../../components/Buttons/SecondaryButton";
import PrimaryButton from "../../../../../../components/Buttons/PrimaryButton";
import SettingsFormRow from "./SettingsFormRow";
import HFSelect from "../../../../../../components/FormElements/HFSelect";
import eventsService from "../../../../../../services/eventsService";
import constructorTableService from "../../../../../../services/constructorTableService";
import eventService from "../../../../../../services/eventsService";

const SettingsTab = ({
  eventLabel,
  modalItemId,
  handleClose,
  eventsRefetch,
}) => {
  const { slug: table_slug } = useParams();

  const emptyFields = {
    left_field: "",
    right_field: "",
    comparison_symbol: "",
    right_field_type: "",
  };

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      action: "",
      condition: [
        {
          group: [emptyFields],
        },
      ],
      after: [
        {
          table: "",
          action: "",
          group: [emptyFields],
        },
      ],
    },
  });

  const { data: tables } = useQuery(
    ["GET_TABLE_LIST"],
    () => constructorTableService.getList(),
    {
      select: (data) => {
        return data?.tables?.map((i) => ({
          label: i.label,
          value: i.slug,
        }));
      },
    }
  );

  const { data: eventById } = useQuery(
    ["GET_EVENT_ITEM", modalItemId],
    () => eventService.getById({ id: modalItemId }),
    {
      enabled: !!modalItemId,
    }
  );

  const { fields, append, remove } = useFieldArray({
    control,
    name: "condition",
  });

  const {
    fields: fieldsAfter,
    append: appendAfter,
    remove: removeAfter,
  } = useFieldArray({
    control,
    name: "after",
  });

  const { mutate: createHandler } = useMutation(
    (data) => eventsService.create(data),
    {
      onSuccess: () => {
        handleClose();
        eventsRefetch();
      },
    }
  );
  const { mutate: updateHandler } = useMutation(
    (data) => eventsService.update(data),
    {
      onSuccess: () => {
        handleClose();
        eventsRefetch();
      },
    }
  );

  const onSubmit = (data) => {
    const collection = {
      does: data.after.map((i) => ({
        fields: i.group.map((j) => ({
          ...j,
          left_field: j.left_field,
          right_field: j.right_field,
        })),
        opperation_type: i.action,
        table_slug: i.table,
      })),
      table_slug,
      id: modalItemId,
      when: {
        action: data.action,
        app_slug: "",
        conditions: data.condition.map((i) => ({
          match_fields: i.group.map((j) => ({
            ...j,
            left_field: "current." + j.left_field,
            right_field: "previous." + j.right_field,
          })),
        })),
      },
    };
    if (modalItemId) {
      updateHandler(collection);
    } else {
      createHandler(collection);
    }
  };

  useEffect(() => {
    if (modalItemId) {
      reset({
        action: eventById?.when?.action,
        condition: eventById?.when?.conditions?.map((i) => ({
          group: i.match_fields?.map((j) => ({
            ...j,
            left_field: j.left_field.split(".")[1],
            right_field: j.right_field.split(".")[1],
          })),
        })),
        after: eventById?.does?.map((i) => ({
          table: i.table_slug,
          action: i.opperation_type,
          group: i.fields.map((j) => j),
        })),
      });
    }
  }, [modalItemId, eventById]);

  return (
    <div className={cls.modal_main}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={cls.main_box}>
          <div className={cls.left}>
            <div className={cls.slug}>
              <span>Когда </span>
              <span>{eventLabel ?? ""}</span>
            </div>
            <div className={cls.line}></div>
            <div className={cls.action}>
              <HFSelect
                control={control}
                options={[
                  { label: "Создать", value: "create" },
                  { label: "Изменить", value: "update" },
                  { label: "Удалить", value: "delete" },
                ]}
                name="action"
                style={{ width: "50%" }}
                placeholder="Действие"
              />
              <div className={cls.terms}>
                <p>Условия</p>
                {fields.map((outerField, index, arr) => (
                  <div key={outerField.id}>
                    <SettingsFormRow
                      watch={watch}
                      nestedFieldName="condition"
                      nestedIndex={index}
                      control={control}
                      removeField={remove}
                    />
                    {fields.length > 0 &&
                      outerField.group?.length > 0 &&
                      arr.length - 1 !== index && (
                        <div className={cls.splitter}>
                          <div></div>
                          <div>OR</div>
                          <div></div>
                        </div>
                      )}
                  </div>
                ))}
              </div>
              <div className={cls.add_condition_btn}>
                <SecondaryButton
                  type="button"
                  style={{ width: "100%" }}
                  onClick={() =>
                    append({
                      group: [
                        {
                          left_field: "",
                          right_field: "",
                          comparison_symbol: "",
                          right_field_type: "",
                        },
                      ],
                    })
                  }
                >
                  <Add />
                  Добавить условия
                </SecondaryButton>
              </div>
            </div>
          </div>
          <div className={cls.right}>
            <div className={cls.after_title}>После</div>
            <div className={cls.line}></div>
            <div className={cls.action}>
              {fieldsAfter.map((field, index) => (
                <div key={field.id} className={cls.after_item}>
                  <div style={{ display: "flex", marginBottom: 8, gap: 8 }}>
                    <HFSelect
                      control={control}
                      options={[
                        { label: "Создать объект", value: "create" },
                        { label: "Изменить объект", value: "update" },
                        { label: "Удалить объект", value: "delete" },
                      ]}
                      name={`after.${index}.action`}
                      placeholder="Действие"
                    />
                    <HFSelect
                      control={control}
                      options={tables}
                      name={`after.${index}.table`}
                      placeholder="Действие"
                    />
                  </div>
                  <SettingsFormRow
                    watch={watch}
                    nestedFieldName="after"
                    nestedIndex={index}
                    control={control}
                    removeField={removeAfter}
                  />
                </div>
              ))}
              <SecondaryButton
                type="button"
                style={{ width: "100%" }}
                onClick={() =>
                  appendAfter({
                    group: [emptyFields],
                  })
                }
              >
                <Add />
                Добавить
              </SecondaryButton>
            </div>
          </div>
        </div>
        <div className={cls.save_btn}>
          <PrimaryButton type="submit">Сохранить</PrimaryButton>
        </div>
      </form>
    </div>
  );
};

export default SettingsTab;
