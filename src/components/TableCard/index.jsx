import { Card } from "@mui/material"
import style from "./style.module.scss"


const TableCard = ({ children, type, disablePagination = false, extra, header, width, cardStyles={} }) => {

  

  return (
    <div className={`${style.wrapper} ${style[type] ?? ""}`}>
      <Card
        className={style.card}
        style={{ width }}
      >
        {(extra || header) && <div className={style.header}>
          <div>{header}</div>
          <div>
            {extra}
          </div>
        </div>}

        <div className={style.body} style={{ padding: disablePagination ? "16px" : "8px 8px 8px 8px", ...cardStyles }} >
          {children}
        </div>
      </Card>
    </div>
  )
}

export default TableCard
