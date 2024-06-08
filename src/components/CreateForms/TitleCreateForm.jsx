import { useFormik } from "formik"
import FTextField from "../FormElements/FTextField"
import RectangleIconButton from "../Buttons/RectangleIconButton"
import { Save, Close } from "@mui/icons-material"
import "./style.scss"
import AddIcon from "@mui/icons-material/Add"
import { useEffect } from "react"

const TitleCreateForm = ({
  onSubmit = () => {},
  formVisible,
  loader,
  initialValues,
  title,
  setFormVisible,
}) => {
  const formik = useFormik({
    initialValues: initialValues ?? {
      title: "",
    },
    onSubmit,
  })

  const submitHandler = (e) => {
    e.preventDefault()
    formik.handleSubmit()
  }

  useEffect(() => {
    if(!formVisible) formik.setFieldValue('title', '')
  }, [formVisible])

  if (!formVisible)
    return (
      <div className="TitleCreateForm create-btn" onClick={() => setFormVisible(true)}>
        <AddIcon />
        <p className="create-title">{title}</p>
      </div>
    )

  return (
    <form className="TitleCreateForm" onSubmit={submitHandler}>
      <>
        <FTextField
          autoFocus
          disabledHelperText
          className="textfield"
          formik={formik}
          name="title"
          placeholder="Enter title"
        />

        <RectangleIconButton color="primary" onClick={submitHandler}>
          <Save color="primary" />
        </RectangleIconButton>
        <RectangleIconButton loader={loader} color="error" onClick={() => setFormVisible(false)}>
          <Close color="error" />
        </RectangleIconButton>
      </>
    </form>
  )
}

export default TitleCreateForm
