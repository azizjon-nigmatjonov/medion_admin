import style from "./style.module.scss"

import ServicesList from "./ServicesList"
import Payments from "./Payments"
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import { useState } from "react"
import { useLocation, useParams } from "react-router-dom"
import onlineAppointmentsService from "../../../../services/cashbox/onlineAppointmentsService"
import offlineAppointmentsService from "../../../../services/cashbox/offlineAppointmentsService"
import PageFallback from "../../../../components/PageFallback"
import Receipt from "./Receipt"
import Footer from "../../../../components/Footer"
import SecondaryButton from "../../../../components/Buttons/SecondaryButton"
import PrimaryButton from "../../../../components/Buttons/PrimaryButton"
import { Save } from "@mui/icons-material"
import useCashboxTabRouter from "../../../../hooks/useCashboxTabRouter"
import { useDispatch } from "react-redux"
import { showAlert } from "../../../../store/alert/alert.thunk"

const AppointmentsForm = () => {
  const { id, type } = useParams()
  const { pathname } = useLocation()
  const { removeTab } = useCashboxTabRouter()
  const dispatch = useDispatch()

  const [loader, setLoader] = useState(true)
  const [btnLoader, setBtnLoader] = useState(false)
  const [isUpdated, setIsUpdated] = useState(false)

  const form = useForm({
    defaultValues: {
      appointment_type: type === "online" ? "booked" : type,
      id,
      payments: [],
      services: [],
    },
  })

  const getData = () => {
    setLoader(true)

    let service
    if (type === "online") service = onlineAppointmentsService
    else service = offlineAppointmentsService

    service
      .getById(id)
      .then((res) => {
        const computedServices = res.services?.map((el) => ({
          ...el,
          checked: true,
        }))

        if (res.payments?.length) setIsUpdated(true)

        form.reset({
          ...form.getValues(),
          ...res,
          services: computedServices,
        })
      })
      .finally(() => setLoader(false))
  }

  const onSubmit = (data) => {
    const computedServices = data.services?.filter(({checked}) => checked)

    let totalPrice = 0

    computedServices?.forEach(
      (service) => (totalPrice += Number(service.service_price))
    )

    let paymentsTotalPrice = 0
    data.payments?.forEach(
      (payment) => (paymentsTotalPrice += Number(payment.amount))
    )

    // const difference = Number(paymentsTotalPrice) - Number(totalPrice)

    // if (difference < 0) {
    //   return dispatch(showAlert("Вы не оплатили полную стоимость приема"))
    // }
    // if (difference > 0) {
    //   return dispatch(showAlert("Вы оплатили больше чем положено"))
    // }

    setBtnLoader(true)

    onlineAppointmentsService
      .update(id, {
        ...data,
        service_ids: computedServices?.map((el) => el.id) ?? [],
        payments: data.payments?.map((el) => ({
          ...el,
          amount: Number(el.amount),
        })),
      })
      .then(() => {
        removeTab(pathname)
      })
      .catch(() => setBtnLoader(false))
  }

  useEffect(() => {
    getData()
  }, [])

  if (loader) return <PageFallback />

  return (
    <>
      <div className={style.page}>
        <div className={style.content}>
          <ServicesList form={form} isUpdated={isUpdated} />

          <Payments form={form} isUpdated={isUpdated} />
        </div>

        <Receipt form={form} />
      </div>
      <Footer
        extra={
          <>
            <SecondaryButton onClick={() => removeTab(pathname)} color="error">
              Закрыть
            </SecondaryButton>
            {!isUpdated && (
              <PrimaryButton
                loader={btnLoader}
                onClick={form.handleSubmit(onSubmit)}
              >
                <Save /> Сохранить
              </PrimaryButton>
            )}
          </>
        }
      />
    </>
  )
}

export default AppointmentsForm
