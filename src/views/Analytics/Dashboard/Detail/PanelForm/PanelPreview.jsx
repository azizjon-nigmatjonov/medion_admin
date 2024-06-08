import { useQuery } from "react-query"
import request from "../../../../../utils/request"
import PanelViews from "../PanelViews"
import styles from "./style.module.scss"

const PanelPreview = ({ form, variablesValue = {}, panel, data, isLoading }) => {
  const title = form.watch('title')


  
  

  return (
    <div className={styles.panel}>
      

      <div className={styles.previewPanel} >
        <PanelViews panel={panel} variablesValue={variablesValue} data={data} isLoading={isLoading} />
      </div>

     
    </div>
  )
}

export default PanelPreview
