import style from "./style.module.scss"
import ReceiptBorder from "../../../../../assets/images/receipt-border.png"
import Logo from "../../../../../assets/images/medion-logo.svg"
import { Divider } from "@mui/material"
import { useWatch } from "react-hook-form"
import { Fragment, useMemo } from "react"
import { numberWithSpaces } from "../../../../../utils/formatNumbers"
import { format } from "date-fns"

const Receipt = ({ form }) => {
  const services = useWatch({
    control: form.control,
    name: "services",
  })

  const computedServices = useMemo(() => {
    return services?.filter((service) => service.checked) ?? []
  }, [services])

  return (
    <div className={style.receipt}>
      <img src={ReceiptBorder} alt="border" className={style.border} />
      <img src={ReceiptBorder} alt="border" className={style.borderBottom} />

      <div className={style.logoBlock}>
        <img src={Logo} alt="logo" />
      </div>

      <Divider className={style.divider} />

      <div className={style.section}>
        <div className={style.row}>
          <b>Medion Clinics</b>
        </div>

        <div className={style.row}>
          <b style={{ paddingRight: 5 }} >Дата: </b>{format(new Date(), 'dd.MM.yyyy HH:mm:ss')}
        </div>
      </div>

      <Divider className={style.divider} />

      <div className={style.section}>
        {computedServices.map((service, index) => (
          <Fragment key={service.id}>
            <div className={style.row}>
              <b>{service.service_name}</b>
            </div>
            <div className={style.row}>
              <div>1 x {numberWithSpaces(service.service_price)}</div>
              <div className={style.dashed} />
              <b>{numberWithSpaces(service.service_price)}</b>
            </div>
          </Fragment>
        ))}
        {/* 
        <div className={style.row}>
          <b>1. Рентген</b>
        </div>

        <div className={style.row}>
          <div>2 x 199 000</div>
          <div className={style.dashed} />
          <b>398 000</b>
        </div>

        <div className={style.row}>
          <div>в т.ч. НДС 15%</div>
          <div className={style.dashed} />
          <b>29 850</b>
        </div> */}
      </div>
    </div>
  )
}

export default Receipt
