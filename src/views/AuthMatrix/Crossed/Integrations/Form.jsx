import { add } from "date-fns/esm"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import CancelButton from "../../../../components/Buttons/CancelButton"
import SaveButton from "../../../../components/Buttons/SaveButton"
import CBreadcrumbs from "../../../../components/CBreadcrumbs"
import FormCard from "../../../../components/FormCard"
import FRow from "../../../../components/FormElements/FRow"

import HFDatePicker from "../../../../components/FormElements/HFDatePicker"
import HFSelect from "../../../../components/FormElements/HFSelect"
import HFTextField from "../../../../components/FormElements/HFTextField"
import Header from "../../../../components/Header"
import integrationService from "../../../../services/auth/integrationService"
import roleService from "../../../../services/roleService"
import { generateSecretKey } from "../../../../utils/generateSecretKey"
import listToOptions from "../../../../utils/listToOptions"
import "./style.scss"

const IntegrationsForm = () => {
  const { platformId, typeId, integrationId, projectId } = useParams()
  const navigate = useNavigate()

  const [btnLoader, setBtnLoader] = useState(false)
  const [loader, setLoader] = useState(true)
  const [rolesList, setRolesList] = useState([])

  const breadCrumbItems = [
    {
      label: "Integrations",
    },
    {
      label: "Create",
    },
  ]

  const fetchRolesList = () => {
    setRolesList([])
    roleService
      .getList({
        "client-platform-id": platformId,
        "client-type-id": typeId,
      })
      .then((res) => setRolesList(listToOptions(res.roles, "name")))
  }

  const fetchData = () => {
    if (!integrationId) return setLoader(false)

    integrationService
      .getById(integrationId)
      .then((res) => {
        reset(res)
        // setSelectedPermissions(res.permissions?.map((permission) => permission.id) ?? [])
      })
      .finally(() => setLoader(false))
  }

  const create = (data) => {
    setBtnLoader(true)
    integrationService
      .create(data)
      .then((res) => {
        navigate(
          `/settings/auth/matrix/${projectId}/${platformId}/${typeId}/crossed`
        )
      })
      .finally(() => setBtnLoader(false))
  }
  

  const update = async (data) => {
    setBtnLoader(true)
    try {
      await integrationService.update({
        ...data,
        id: integrationId,
      })

      navigate(
        `/settings/auth/matrix/${projectId}/${platformId}/${typeId}/crossed`
      )
    } finally {
      setBtnLoader(false)
    }
  }

  const onSubmit = (values) => {
    if (integrationId) return update(values)
    create(values)
  }

  useEffect(() => {
    fetchData()
    fetchRolesList()
  }, [])

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      active: 1,
      client_platform_id: platformId,
      client_type_id: typeId,
      project_id: projectId,
      title: "",
      expires_at: add(new Date(), { months: 6 }),
      ip_whitelist: "",
      role_id: "",
      secret_key: generateSecretKey(),
    } })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Header
        loader={loader}
        backButtonLink={-1}
        extra={
          <>
            <CancelButton onClick={() => navigate(-1)} />
            <SaveButton type="submit" loading={btnLoader} />
          </>
        }
      >
        <CBreadcrumbs withDefautlIcon items={breadCrumbItems} />
      </Header>

      <div className="IntegrationsForm p-2">
        <FormCard visible={!loader} title="Main info" className="form-card">
          <div className="side">
            <FRow label="Title">
              <HFTextField autoFocus fullWidth control={control} name="title" />
            </FRow>
            <FRow label="Role">
              <HFSelect
                options={rolesList}
                fullWidth
                control={control}
                name="role_id"
              />
            </FRow>
            <FRow label="Secret key">
              <HFTextField fullWidth control={control} name="secret_key" />
            </FRow>
          </div>

          <div className="side">
            <FRow label="Whitelist">
              <HFTextField fullWidth control={control} name="ip_whitelist" />
            </FRow>

            <FRow label="Expires date">
              <HFDatePicker
                width="100%"
                fullWidth
                control={control}
                name="expires_at"
              />
            </FRow>
          </div>
        </FormCard>
      </div>
    </form>
  )
}

export default IntegrationsForm
