import FRow from "../../../../../../components/FormElements/FRow";
import HFSelect from "../../../../../../components/FormElements/HFSelect";
import styles from "./style.module.scss";

const SelectBySwitchAttributes = ({ control, fieldList }) => {
  
  return (
    <>
      <div className={styles.settingsBlockHeader}>
        <h2>Settings</h2>
      </div>
      <div className="p-2">
        <FRow label="">
          <HFSelect options={fieldList} control={control} name='attributes.first_field' />
        </FRow>

        <FRow label="">
            <HFSelect options={fieldList} control={control} name='attributes.second_field' />
        </FRow>
      </div>
    </>
  );
};

export default SelectBySwitchAttributes;
