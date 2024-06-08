


import HFSwitch from "../../../../../../components/FormElements/HFSwitch";
import styles from "./style.module.scss"

const TableAttributes = ({ control }) => {
  return ( <>
   <div className={styles.settingsSectionHeader}>Table attributes</div>
   <div className="p-2" >
      <HFSwitch control={control} label="Pagination" name="attributes.pagination" />
   </div>
  </> );
}
 
export default TableAttributes;