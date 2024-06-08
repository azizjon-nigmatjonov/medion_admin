import { useForm } from "react-hook-form"
import { useMutation, useQuery } from "react-query"
import { useNavigate, useParams } from "react-router-dom"
import SaveButton from "../../../../components/Buttons/SaveButton"
import Footer from "../../../../components/Footer"
import FRow from "../../../../components/FormElements/FRow"
import HFSelect from "../../../../components/FormElements/HFSelect"
import HFTextField from "../../../../components/FormElements/HFTextField"
import PageFallback from "../../../../components/PageFallback"
import SelectOptionsCreator from "../../../../components/SelectOptionsCreator"
import variableService from "../../../../services/analytics/variableService"
import styles from "./style.module.scss"

const variableTypes = [
  {
    label: "QUERY",
    value: "QUERY",
  },
  {
    label: "CUSTOM",
    value: "CUSTOM",
  },
]

const VariableCreateForm = () => {
  const { id, variableId } = useParams()
  const { control, reset, handleSubmit, watch } = useForm()
  const navigate = useNavigate()

  const { isLoading } = useQuery(
    ["GET_VARIABLE_DATA", variableId],
    () => {
      if (!variableId)
        return {
          dashboard_id: id,
          label: "",
          slug: "",
          field_slug: "",
          view_field_slug: "",
          query: "",
          type: "",
          options: [],
        }
      return variableService.getById(variableId)
    },
    {
      onSuccess: (data) => {
        reset(data)
      },
    }
  )

  const variableType = watch("type")

  const { mutate, isLoading: btnLoading } = useMutation(
    (data) => {
      if (!variableId) return variableService.create(data)
      return variableService.update(data)
    },
    {
      onSuccess: () => {
        navigate(`/analytics/dashboard/${id}/settings/variables`)
      },
    }
  )

  return (
    <div className={styles.formCard}>
      <h2 className={styles.title}>Общие сведение</h2>

      {isLoading ? (
        <PageFallback />
      ) : (
        <div className={styles.mainBlock}>
          <div className={styles.row}>
            <FRow label="Названия">
              <HFTextField control={control} name="label" fullWidth required />
            </FRow>

            <FRow label="Тип">
              <HFSelect
                options={variableTypes}
                control={control}
                name="type"
                required
              />
            </FRow>
          </div>

          <div className={styles.row}>
            <FRow label="Slug">
              <HFTextField control={control} name="slug" fullWidth required />
            </FRow>

            {variableType === "CUSTOM" && (
              <FRow label="Options">
                <SelectOptionsCreator control={control} name="options" />
              </FRow>
            )}

            {variableType === "QUERY" && (
              <FRow label="Query">
                <HFTextField control={control} name="query" fullWidth />
              </FRow>
            )}
          </div>

          {variableType === "QUERY" && (
            <div className={styles.row}>
              <FRow label="Field slug">
                <HFTextField control={control} name="field_slug" fullWidth />
              </FRow>

              <FRow label="View field slug">
                <HFTextField control={control} name="view_field_slug" fullWidth />
              </FRow>
            </div>
          )}
        </div>
      )}

      <Footer
        extra={
          <SaveButton loading={btnLoading} onClick={handleSubmit(mutate)} />
        }
      />
    </div>
  )
}

export default VariableCreateForm
