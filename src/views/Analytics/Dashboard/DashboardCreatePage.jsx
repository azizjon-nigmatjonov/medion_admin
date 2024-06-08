import { useForm } from "react-hook-form"
import { useMutation } from "react-query"
import { useLocation } from "react-router-dom"
import CancelButton from "../../../components/Buttons/CancelButton"
import SaveButton from "../../../components/Buttons/SaveButton"
import Footer from "../../../components/Footer"
import FormCard from "../../../components/FormCard"
import FRow from "../../../components/FormElements/FRow"
import HFIconPicker from "../../../components/FormElements/HFIconPicker"
import HFTextField from "../../../components/FormElements/HFTextField"
import useAnalyticsTabRouter from "../../../hooks/useAnalyticsTabRouter"
import dashboardService from "../../../services/analytics/dashboardService"

const DashboardCreatePage = () => {
  const { pathname } = useLocation()
  const { removeTab } = useAnalyticsTabRouter()

  const { control, handleSubmit } = useForm({
    defaultValues: {
      title: "",
      icon: "",
    },
  })

  const { mutate, isLoading } = useMutation(
    (data) => {
      return dashboardService.create(data)
    },
    {
      onSuccess: () => {
        removeTab(pathname)
      },
    }
  )

  const onSubmit = (data) => {
    mutate(data)
  }

  return (
    <div>
      <div className="p-2" style={{ minHeight: "calc(100vh - 112px)" }}>
        <FormCard title="Основное">
          <FRow label="Названия дешборда">
            <HFTextField control={control} name="name" fullWidth required />
          </FRow>

          <FRow label="Иконка">
            <HFIconPicker control={control} name="icon" required />
          </FRow>
        </FormCard>
      </div>

      <Footer
        extra={
          <>
            <CancelButton onClick={() => removeTab(pathname)} />
            <SaveButton loading={isLoading} onClick={handleSubmit(onSubmit)} />
          </>
        }
      />
    </div>
  )
}

export default DashboardCreatePage
