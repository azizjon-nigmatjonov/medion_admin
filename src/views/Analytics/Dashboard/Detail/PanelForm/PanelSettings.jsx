import FRow from "../../../../../components/FormElements/FRow"
import HFSelect from "../../../../../components/FormElements/HFSelect"
import HFTextField from "../../../../../components/FormElements/HFTextField"
import { dashboardPanelTypes } from "../../../../../utils/constants/dashboardPanelTypes"
import PanelAttributes from "./PanelAttributes"
import styles from "./style.module.scss"

const PanelSettings = ({ form, columns }) => {
  return (
    <div className={styles.panelSettings}>
      <div className={styles.form}>
        <div className={styles.settingsSectionHeader}>Main info</div>

        <div className="p-2">
          <FRow label={"Title"}>
            <HFTextField control={form.control} name="title" fullWidth />
          </FRow>

          <FRow label={"Type"}>
            <HFSelect
              control={form.control}
              name="attributes.type"
              options={dashboardPanelTypes}
              optionType="GROUP"
            />
          </FRow>
        </div>


        <PanelAttributes form={form} columns={columns} />

      </div>
    </div>
  )
}

export default PanelSettings
