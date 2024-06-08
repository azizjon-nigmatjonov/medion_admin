import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useParams } from "react-router-dom"
import FormElementGenerator from "../../../components/ElementGenerators/FormElementGenerator"
import LargeModalCard from "../../../components/LargeModalCard"
import constructorObjectService from "../../../services/constructorObjectService"
import constructorSectionService from "../../../services/constructorSectionService"

const RelationCreateModal = ({ table, onCreate, closeModal }) => {
  const { tableSlug, id } = useParams()

  const [loader, setLoader] = useState(true)
  const [btnLoader, setBtnLoader] = useState(false)

  const [fields, setFields] = useState([])

  const getFields = async () => {
    try {
      const { sections = [] } = await constructorSectionService.getList({
        table_slug: table.slug,
      })

      const computedFields = []

      sections.forEach((section) => {
        section.fields.forEach((field) => {
          computedFields.push(field)
        })
      })

      setFields(computedFields)
    } finally {
      setLoader(false)
    }
  }

  const { handleSubmit, control } = useForm({
    defaultValues: {
      [`${tableSlug}_id`]: id
    },
  })

  const onSubmit = async (values) => {
    setBtnLoader(true)
    try {
      
      const res = await constructorObjectService.create(table.slug, { data: values })

      onCreate(res)

      closeModal()

    } finally {
      setBtnLoader(false)
    }
  }

  useEffect(() => {
    getFields()
  }, [])

  return (
    <LargeModalCard
      title={table.label}
      loader={loader}
      btnLoader={btnLoader}
      onSaveButtonClick={handleSubmit(onSubmit)}
      onClose={closeModal}
    >
      {fields.map((field) => (
        <FormElementGenerator key={field.id} field={field} control={control} disableHelperText />
      ))}
    </LargeModalCard>
  )
}

export default RelationCreateModal
