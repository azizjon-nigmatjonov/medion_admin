import { Switch } from "@mui/material";
import { useId, useMemo } from "react";
import { Controller, useWatch } from "react-hook-form";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import constructorObjectService from "../../services/constructorObjectService";
import FormElementGenerator from "../ElementGenerators/FormElementGenerator";
import FRow from "./FRow";

const HFSelectBySwitch = ({
  control,
  name,
  field,
  disabledHelperText,
  tabIndex,
  isBlackBg,
  onChange = () => {},
  labelProps,
  defaultValue = false,
  ...props
}) => {
  const id = useId();
  const {  tableSlug, appId } = useParams();
  const selectSwitch = useWatch({
    control,
    name: 'select_by_switch'
  })
  
  const { data: fieldList } = useQuery(
    ["GET_FIELD_LIST", tableSlug],
    () =>
    constructorObjectService.getList(tableSlug, {
        data: {
          limit:0,
          offsett: 0,
          app_id: appId 
        }
      }),
    {
      enabled: !!tableSlug,
      select: (res) => {
        return (
          res?.data?.fields ?? []
        );
      },
    }
  );

  const computedField = useMemo(() => {
    if(selectSwitch) {
      return fieldList?.find((item) => item?.slug === field?.attributes.first_field)
    } else {
      return fieldList?.find((item) => item?.slug === field?.attributes.second_field)
    }
  }, [field, fieldList, selectSwitch])

  return (
   <FRow label={field?.label}>
     <Controller
      control={control}
      name={'select_by_switch'}
      defaultValue={defaultValue}
      render={({
        field: { onChange: formOnChange, value },
        fieldState: { error },
      }) => {
        return (
          <div
            className={!disabledHelperText ? "mb-1" : ""}
            style={{
              background: isBlackBg ? "#2A2D34" : "",
              color: isBlackBg ? "#fff" : "",
            }}
          >
            <Switch
              {...props}
              autoFocus={tabIndex === 1}
                inputProps={{ tabIndex }}
              checked={value ?? false}
              onChange={(e, val) => {
                formOnChange(val);
                onChange(val);
              }}
            />
            <FormElementGenerator control={control} field={computedField} />
            
          </div>
        );
      }}
    ></Controller>
   </FRow>
  );
};

export default HFSelectBySwitch;
