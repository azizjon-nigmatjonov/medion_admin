import { DragHandle, Remove } from "@mui/icons-material"
import { Divider, TextField } from "@mui/material"
import { useForm } from "react-hook-form"
import { useMutation, useQuery } from "react-query"
import { useDispatch } from "react-redux"
import SaveButton from "../../../components/Buttons/SaveButton"
import Footer from "../../../components/Footer"
import FRow from "../../../components/FormElements/FRow"
import HFTextField from "../../../components/FormElements/HFTextField"
import PageFallback from "../../../components/PageFallback"
import TableCard from "../../../components/TableCard"
import { cashboxActions } from "../../../store/cashbox/cashbox.slice"
import request from "../../../utils/request"
import PaymentTypeIconGenerator from "../components/PaymentTypeIconGenerator"
import styles from "./style.module.scss"

const CashboxOpening = () => {
  const dispatch = useDispatch()
  const { control, reset, watch, handleSubmit } = useForm({
    mode: "all",
  })

  const { isLoading } = useQuery(
    ["GET_CASHBOX_OPENING_DATA"],
    () => {
      return request.get("/open-cashbox")
    },
    {
      onSuccess: (res) => {
        reset({
          overall_payments: res?.overall_payments?.map((el) => ({
            ...el,
            amount: el.amount ?? 0,
          })),
        })
      },
    }
  )

  const data = watch()

  const { mutate, isLoading: btnLoading } = useMutation(
    (data) => {
      return request.post("/cashbox_transaction", data)
    },
    {
      onSuccess: () => {
        dispatch(cashboxActions.setStatus("Открыто"))
      },
    }
  )

  const onSubmit = (values) => {
    let amount = 0
    let summ = 0

    values?.overall_payments?.forEach((el) => {
      amount += Number(el.amount ?? 0)
      summ += Number(el.summ ?? 0)
    })

    const data = {
      comment: values.comment,
      status: "Открыто",
      amount_of_money: summ - amount,
    }
    mutate(data)
  }

  if (isLoading) return <PageFallback />

  return (
    <>
      <div className={styles.page}>
        <TableCard>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Тип</th>
                <th>Факт</th>
                <th></th>
                <th>План</th>
                <th></th>
                <th>Разница</th>
              </tr>
            </thead>

            <tbody>
              {data?.overall_payments?.map((payment, index) => (
                <tr key={payment.type}>
                  <td>
                    <div className={styles.iconBlock}>
                      <PaymentTypeIconGenerator type={payment.type} />
                    </div>
                  </td>
                  <td>
                    <HFTextField
                      control={control}
                      name={`overall_payments.[${index}].summ`}
                      fullWidth
                    />
                  </td>
                  <td>
                    <div className={styles.iconBlock}>
                      <Remove color="primary" />
                    </div>
                  </td>
                  <td>
                    <TextField
                      size="small"
                      InputProps={{
                        readOnly: true,
                      }}
                      value={payment.amount ?? 0}
                      fullWidth
                      type="number"
                    />
                  </td>
                  <td>
                    <div className={styles.iconBlock}>
                      <DragHandle color="primary" />
                    </div>
                  </td>
                  <td>
                    <TextField
                      size="small"
                      value={payment.summ - payment.amount}
                      fullWidth
                      type="number"
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Divider className={styles.divider} />

          <FRow label="Комментария">
            <HFTextField
              fullWidth
              control={control}
              name="comment"
              multiline
              rows={4}
              placeholder="Enter a comment"
              readOnly
            />
          </FRow>
        </TableCard>
      </div>
      <Footer
        extra={
          <SaveButton onClick={handleSubmit(onSubmit)} loading={btnLoading} />
        }
      ></Footer>
    </>
  )
}

export default CashboxOpening
