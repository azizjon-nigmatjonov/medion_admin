import { Divider } from "@mui/material"
import { useMemo } from "react"
import FRow from "../../../../../../components/FormElements/FRow"
import HFTextField from "../../../../../../components/FormElements/HFTextField"
import styles from "./style.module.scss"


const FrontendFormulaAttributes = ({ control, mainForm }) => {

  const fieldsList = useMemo(() => {
    return mainForm.getValues('fields') ?? []
  }, [])

  return (
    <>
      <div className={styles.settingsBlockHeader}>
        <h2>Settings</h2>
      </div>
      <div className="p-2" >
        <FRow label="Formula" >
          <HFTextField 
            control={control}
            name="attributes.formula"
            fullWidth
            multiline
            rows={4}
            placeholder="Formula..."
          />
        </FRow>

        <Divider className="my-1" />

        <h2>Fields list:</h2>

        {
          fieldsList.map(field => (
            <div>{field.label} - <strong>{field.slug}</strong> </div>
          ))
        }

      </div>

      

    </>
  )
}

export default FrontendFormulaAttributes
