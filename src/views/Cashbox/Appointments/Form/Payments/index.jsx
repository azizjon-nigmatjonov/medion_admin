import { Close } from "@mui/icons-material"
import { Divider, IconButton } from "@mui/material"
import { useMemo } from "react"
import { Controller, useFieldArray, useWatch } from "react-hook-form"
import FormCard from "../../../../../components/FormCard"
import { numberWithSpaces } from "../../../../../utils/formatNumbers"
import PaymentTypeSelector from "../../components/PaymentTypeSelector"
import style from "./style.module.scss"

const Payments = ({ form, isUpdated }) => {
  const services = useWatch({
    control: form.control,
    name: "services",
  })

  const computedPayments = useWatch({
    control: form.control,
    name: "payments",
  })

  const {
    fields: payments,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "payments",
  })

  const computedServices = useMemo(() => {
    return services?.filter((service) => service.checked) ?? []
  }, [services])

  const totalPrice = useMemo(() => {
    let result = 0

    computedServices.forEach(
      (service) => (result += Number(service.service_price))
    )
    return result
  }, [computedServices])

  const paymentsTotalPrice = useMemo(() => {
    let result = 0
    computedPayments?.forEach(
      (payment) => (result += Number(payment.amount))
    )
    return result
    
  }, [computedPayments])

  const difference = Number(paymentsTotalPrice) - Number(totalPrice)

  const addNewPayment = (type) => {
    append({
      payment_type: type,
      amount: 0,
    })
  }

  return (
    <FormCard title="Оплата услуги" maxWidth="auto">
      <div className={style.row}>
        <div className={style.card}>
          <div className={style.label}>Итого</div>
          <div className={style.value}>{numberWithSpaces(totalPrice)}</div>
        </div>

        <div className={style.card}>
          <div className={style.label}>К оплате:</div>
          <div className={style.value}>{numberWithSpaces(paymentsTotalPrice)}</div>
        </div>

        <div className={style.card}>
          <div className={style.label}>Долг:</div>
          <div className={style.value} style={{ color: difference > 0 ? "#1AC19D" : "#F2271C" }}>
            { numberWithSpaces(difference) }
          </div>
        </div>
      </div>

      <Divider className="mb-2" />

      {/* ---------------------------------------------- */}

      <div className={style.row}>
        {payments?.map((payment, index) => (
          <div key={payment.id} className={style.paymentCard}>
            <div className={style.header}>
              <div>{payment.payment_type}</div>

              {!isUpdated && <IconButton onClick={() => remove(index)}>
                <Close />
              </IconButton>}
            </div>

            <div className={style.body}>
              <Controller
                control={form.control}
                name={`payments[${index}].amount`}
                defaultValue={0}
                render={({ field: { onChange, value } }) => (
                  <input readOnly={isUpdated} type="number" min={0} value={value == 0 ? '' : value} onChange={onChange} autofocus />
                )}
              />
            </div>
          </div>
        ))}

        {!isUpdated && <div className={style.paymentCard}>
          <div className={style.createBody}>
            <PaymentTypeSelector onSelect={addNewPayment} />
          </div>
        </div>}
      </div>
    </FormCard>
  )
}

export default Payments
