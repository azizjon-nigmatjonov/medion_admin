import FRow from "../../../../../../components/FormElements/FRow"
import HFSwitch from "../../../../../../components/FormElements/HFSwitch"
import SelectOptionsCreator from "../../../../../../components/SelectOptionsCreator"
import styles from "./style.module.scss"

const PickListAttributes = ({ control, onClose, onSaveButtonClick }) => {
  return (
    <>
      <div className={styles.settingsBlockHeader}>
        <h2>Settings</h2>
      </div>
    <div className="p-2">
      <HFSwitch control={control} name="attributes.has_icon" label="Icon" />

      <HFSwitch control={control} name="attributes.has_color" label="Color" />

      <HFSwitch
        control={control}
        name="attributes.is_multiselect"
        label="Multiselect"
      />

      <FRow label="Pick list option">
        <SelectOptionsCreator control={control} name="attributes.options" />
      </FRow>
    </div>
    </>
  )
}

export default PickListAttributes
