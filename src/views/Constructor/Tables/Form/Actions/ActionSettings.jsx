import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import PrimaryButton from "../../../../../components/Buttons/PrimaryButton";
import FRow from "../../../../../components/FormElements/FRow";
import HFAutocomplete from "../../../../../components/FormElements/HFAutocomplete";
import HFIconPicker from "../../../../../components/FormElements/HFIconPicker";
import HFTextField from "../../../../../components/FormElements/HFTextField";
import HFSwitch from "../../../../../components/FormElements/HFSwitch";
import constructorCustomEventService from "../../../../../services/constructorCustomEventService";
import listToOptions from "../../../../../utils/listToOptions";
import request from "../../../../../utils/request";
import styles from "./style.module.scss";
import HFSelect from "../../../../../components/FormElements/HFSelect";
import TableActions from "./TableActions";

const actionTypeList = [
  { label: "HTTP", value: "HTTP" },
  { label: "after", value: "after" },
  { label: "before", value: "before" },
];
const methodList = [
  { label: "UPDATE", value: "UPDATE" },
  { label: "CREATE", value: "CREATE" },
  { label: "DELETE", value: "DELETE" },
  { label: "MULTIPLE_UPDATE", value: "MULTIPLE_UPDATE" },
  { label: "APPEND_MANY2MANY", value: "APPEND_MANY2MANY" },
  { label: "DELETE_MANY2MANY", value: "DELETE_MANY2MANY" },
];

const typeList = [
  { label: "TABLE", value: "TABLE" },
  { label: "OBJECTID", value: "OBJECTID" },
  { label: "HARDCODE", value: "HARDCODE" },
];

const ActionSettings = ({
  closeSettingsBlock = () => {},
  onUpdate = () => {},
  onCreate = () => {},
  action,
  formType,
  height,
}) => {
  const { slug } = useParams();

  const [loader, setLoader] = useState(false);

  const { handleSubmit, control, reset, watch, setValue } = useForm({
    defaultValues: {
      table_slug: slug,
    },
  });

  const { data: functions = [] } = useQuery(
    ["GET_FUNCTIONS_LIST"],
    () => {
      return request.get("/function");
    },
    {
      select: (res) => {
        return listToOptions(res.functions, "name", "id");
      },
    }
  );

  const createAction = (data) => {
    setLoader(true);

    constructorCustomEventService
      .create(data)
      .then((res) => {
        closeSettingsBlock();
        onCreate(res);
      })
      .catch(() => setLoader(false));
  };

  const updateAction = (data) => {
    setLoader(true);

    constructorCustomEventService
      .update(data)
      .then((res) => {
        closeSettingsBlock();
        onUpdate(data);
      })
      .catch(() => setLoader(false));
  };

  const submitHandler = (values) => {
    if (formType === "CREATE") createAction(values);
    else updateAction(values);
  };

  useEffect(() => {
    if (formType === "CREATE") return;
    reset(action);
  }, [action, formType, reset]);

  return (
    <div className={styles.settingsBlock}>
      <div className={styles.settingsBlockHeader}>
        <h2>{formType === "CREATE" ? "Create" : "Edit"} action</h2>

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
            <FRow label="Icon" required>
              <HFIconPicker control={control} required name="icon" />
            </FRow>
            <FRow label="Label" required>
              <HFTextField
                name="label"
                control={control}
                placeholder="Label"
                fullWidth
                required
              />
            </FRow>
            <FRow label="Function" required>
              <HFAutocomplete
                name="event_path"
                control={control}
                placeholder="Event path"
                options={functions}
                required
              />
            </FRow>
            <FRow label="Redirect url">
              <HFTextField
                name="url"
                control={control}
                placeholder="Redirect url"
                options={functions}
                fullWidth
              />
            </FRow>
            <FRow label="Action type">
              <HFSelect
                name="action_type"
                control={control}
                placeholder="action type"
                options={actionTypeList}
                fullWidth
              />
            </FRow>
            <FRow label="Method">
              <HFSelect
                name="method"
                control={control}
                placeholder="Redirect url"
                options={methodList}
                fullWidth
              />
            </FRow>

            <TableActions
              control={control}
              typeList={typeList}
              slug={slug}
              watch={watch}
              setValue={setValue}
            />

            <FRow label="Disabled">
              <HFSwitch name="disabled" control={control} />
            </FRow>
          </div>

          <div className={styles.settingsFooter}>
            <PrimaryButton
              size="large"
              className={styles.button}
              style={{ width: "100%" }}
              onClick={handleSubmit(submitHandler)}
              loader={loader}
            >
              Сохранить
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActionSettings;
