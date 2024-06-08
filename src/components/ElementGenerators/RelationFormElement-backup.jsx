import { format } from "date-fns"
import { useEffect, useMemo, useState } from "react"
import constructorObjectService from "../../services/constructorObjectService"
import { Autocomplete, CircularProgress, TextField } from "@mui/material"
import FRow from "../FormElements/FRow"
import { Controller } from "react-hook-form"
import FEditableRow from "../FormElements/FEditableRow"
import IconGenerator from "../IconPicker/IconGenerator"
import useDebounce from "../../hooks/useDebounce"
import useTabRouter from "../../hooks/useTabRouter"
import { generateGUID } from "../../utils/generateID"
import { getRelationFieldLabel } from "../../utils/getRelationFieldLabel"

const RelationFormElement = ({
  control,
  field,
  isLayout,
  sectionIndex,
  fieldIndex,
  column,
  mainForm,
  disabledHelperText,
  ...props
}) => {
  const tableSlug = useMemo(() => {
    return field.id.split("#")?.[0] ?? ""
  }, [field.id])

  if (!isLayout)
    return (
      <FRow label={field.label} required={field.required}>
        <Controller
          control={control}
          name={`${tableSlug}_id`}
          defaultValue={null}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <AutoCompleteElement
              value={value}
              setValue={onChange}
              field={field}
              tableSlug={tableSlug}
              error={error}
              disabledHelperText={disabledHelperText}
            />
          )}
        />
      </FRow>
    )

  return (
    <Controller
      control={mainForm.control}
      name={`sections[${sectionIndex}].fields[${fieldIndex}].field_name`}
      defaultValue={field.label}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <FEditableRow
          label={value}
          onLabelChange={onChange}
          required={field.required}
        >
          <Controller
            control={control}
            name={`${tableSlug}_id`}
            defaultValue={null}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <AutoCompleteElement
                value={value}
                setValue={onChange}
                field={field}
                tableSlug={tableSlug}
                error={error}
                disabledHelperText={disabledHelperText}
              />
            )}
          />
        </FEditableRow>
      )}
    ></Controller>
  )
}

const AutoCompleteElement = ({
  field,
  value,
  tableSlug,
  setValue,
  error,
  disabledHelperText,
}) => {
  const [loader, setLoader] = useState(false)
  const { navigateToForm } = useTabRouter()

  const [options, setOptions] = useState([])
  const [searchText, setSearchText] = useState("")

  const id = useMemo(() => {
    return generateGUID()
  }, [])
  
  const getOptionLabel = (option) => {
    return getRelationFieldLabel(field, option)
  }

  const computedValue = useMemo(() => {
    const findedOption = options.find((el) => el?.guid === value)
    return findedOption ? [findedOption] : []
  }, [options, value])


  const getOptions = (search) => {
    setLoader(true)
    constructorObjectService
      .getList(tableSlug, { data: { search } })
      .then((res) => {
        if(JSON.stringify(res.data.response) !== JSON.stringify(options)) setOptions(res.data.response ?? [])
      })
      .finally(() => setLoader(false))
  }

  const debouncedGetOptions = useDebounce(getOptions, 500)


  const getValueOption = () => {
    setLoader(true)
    constructorObjectService
      .getById(tableSlug, value)
      .then((res) => {
        setOptions([res.data.response])
      })
      .finally(() => setLoader(false))
  }

  // useDebouncedWatch(
  //   () => {
  //     getOptions()
  //   },
  //   [searchText],
  //   500
  // )

  useEffect(() => {
    if (value) getValueOption()
    else getOptions()
  }, [])

  return (
    <Autocomplete
      id={id}
      options={options}
      getOptionLabel={getOptionLabel}
      disableCloseOnSelect
      multiple
      onInputChange={(event, newInputValue) => {
        debouncedGetOptions(newInputValue)
        // setSearchText(newInputValue)
      }}
      filterOptions={(x) => x}
      value={computedValue}
      loading={loader}
      onChange={(event, newValue) => {
        setValue(newValue?.[newValue?.length - 1]?.guid ?? null)
      }}
      renderTags={(value, index) => {
        return (
          <>
            {getOptionLabel(value[0])}
            <IconGenerator
              icon="arrow-up-right-from-square.svg"
              style={{ marginLeft: "10px", cursor: "pointer" }}
              size={15}
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                navigateToForm(tableSlug, "EDIT", value[0])
              }}
            />
          </>
        )
      }}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            size="small"
            error={error}
            helperText={!disabledHelperText && error?.message}
            inputProps={{
              ...params.inputProps,
              // value: '0000'
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loader ? <CircularProgress color="primary" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )
      }}
    />
  )
}

export default RelationFormElement
