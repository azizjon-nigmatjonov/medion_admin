import { Add, Delete } from "@mui/icons-material"
import { useFieldArray, useWatch } from "react-hook-form"
import { generateID } from "../../utils/generateID"
import RectangleIconButton from "../Buttons/RectangleIconButton"
import HFColorPicker from "../FormElements/HFColorPicker"
import HFIconPicker from "../FormElements/HFIconPicker"
import HFTextField from "../FormElements/HFTextField"
import styles from "./style.module.scss"

const SelectOptionsCreator = ({ control, name }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
    keyName: "key"
  })
  
  const hasIcon = useWatch({
    control,
    name: 'attributes.has_icon',
  })
  
  const hasColor = useWatch({
    control,
    name: 'attributes.has_color',
  })

  const addNewOption = () => {
    const newOption = {
      id: generateID(),
      value: '',
      icon: '',
      color: ''
    }
    append(newOption)
  }

  return (
    <div className={styles.wrapper} >
      {Boolean(fields?.length) && (
        <div className={styles.block}>
          {fields.map((field, index) => (
            <div className={styles.row} key={field.id}>
              {hasColor && <HFColorPicker control={control} name={`${name}[${index}].color`} />}
              {hasIcon && <HFIconPicker shape="rectangle" control={control} name={`${name}[${index}].icon`} />}
              <HFTextField
                placeholder={`Option ${index + 1} label`}
                disabledHelperText
                size="small"
                fullWidth
                control={control}
                name={`${name}[${index}].label`}
                className={styles.input}
              />
              <HFTextField
                placeholder={`Option ${index + 1} value`}
                disabledHelperText
                size="small"
                fullWidth
                control={control}
                name={`${name}[${index}].value`}
                className={styles.input}
              />
              <RectangleIconButton color="error" onClick={() => remove(index)}>
                <Delete color="error" />
              </RectangleIconButton>
            </div>
          ))}
        </div>
      )}

      <div className={styles.createButton} onClick={addNewOption}>
        <Add />
        Add Options
      </div>
    </div>
  )
}

export default SelectOptionsCreator
