import { CircularProgress, IconButton, Skeleton } from "@mui/material"
import SaveIcon from "@mui/icons-material/Save"
import { useEffect } from "react"
import OutsideClickHandler from "react-outside-click-handler"
import { useForm } from "react-hook-form"
import HFTextField from "../FormElements/HFTextField"
import styles from "./style.module.scss"

const CreateRow = ({
  onSubmit,
  loader,
  visible,
  btnLoader,
  setVisible = () => {},
  setLoader = () => {},
  initialTitle,
  placeholder = "",
  color = "primary",
}) => {

  const {control, reset, handleSubmit} = useForm({
    defaultValues: {
      title: initialTitle || "",
    }
  })

  useEffect(() => {
    if (visible) {
      setLoader(false)
    } else {
      reset({
        title: initialTitle || ""
      })
    }
  }, [visible])

  return (
    <OutsideClickHandler
      display="contents"
      onOutsideClick={() => setVisible(false)}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles.createRow}
        style={{ width: "100%" }}
      >
        {loader ? (
          <Skeleton variant="text" style={{ width: "100%" }} />
        ) : (
          <>
            <HFTextField
              onClick={(e) => e.stopPropagation()}
              fullWidth
              control={control}
              name="title"
              disabledHelperText
              inputRef={(input) => input && visible && input.focus()}
              inputProps={{
                style: { color: color === "primary" ? "#000" : "#fff" },
              }}
            />
            <IconButton color={color} onClick={handleSubmit(onSubmit)}>
              {btnLoader ? <CircularProgress size={14} /> : <SaveIcon />}
            </IconButton>
          </>
        )}
      </form>
    </OutsideClickHandler>
  )
}

export default CreateRow
