import style from './style.module.scss'
import ChartAccounts from "@/views/Objects/components/ViewSettings/ChartAccounts";
import {useFieldArray} from "react-hook-form";
import TableRowButton from "@/components/TableRowButton";
import TableCancelButton from "@/components/TableRowButton/CancelButton";
import CreateButton from "@/components/Buttons/CreateButton";
import styles from "@/components/TableRowButton/style.module.scss";
import {CircularProgress} from "@mui/material";
import {Add} from "@mui/icons-material";
import ChartPercentages from './ChartPercentages';

const ChartAccountsWrapper = ({viewId, form}) => {
  const {fields: chart, move} = useFieldArray({
    control: form.control,
    name: "attributes.chart_of_accounts",
    keyName: "key",
  })

  const {fields: charts, append, remove} = useFieldArray({
    control: form.control,
    name: "chartOfAccounts",
  });

  const addChart = () => {
    append({})
  }

  const removeChart = (index) => {
    remove(index)
  }

  return (
    <div className={style.chartAccounts}>
      <ChartPercentages form={form} charts={charts} />
      {
        charts.map((item, index) => (
          <>
            <ChartAccounts form={form} viewId={viewId} key={item.id} addChart={addChart} index={index} charts={charts} removeChart={removeChart}/>

          </>
        ))
      }

      <div className={style.footerButton}>
        <div
          className={styles.createButton}
          onClick={addChart}
        >
          <Add color="primary"/>
          <p>Добавить</p>
        </div>
      </div>
    </div>
  )
}

export default ChartAccountsWrapper