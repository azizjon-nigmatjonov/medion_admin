import DatePicker from "react-multi-date-picker"
import TimePickerPlugin from "./Plugins/TimePickerPlugin"
import "react-multi-date-picker/styles/layouts/mobile.css"
import "./style2.scss"
import { InputAdornment, TextField } from "@mui/material"
import { DateRange } from "@mui/icons-material"

const CTimePicker = ({ value, onChange, classes, isBlackBg, isFormEdit, tabIndex }) => {
  const getValue = () => {
    if (!value) return ""

    const result = new Date()

    result.setHours(value.split(":")?.[0])
    result.setMinutes(value.split(":")?.[1])

    return result
  }

  return (
    <DatePicker
      render={(value, openCalendar, handleChange) => {
        return (
          <TextField
            value={value}
            onClick={openCalendar}
            onChange={handleChange}
            size="small"
            fullWidth
            autoFocus={tabIndex === 1}
            autoComplete="off"
            InputProps={{
                inputProps: { tabIndex },
              classes: {
                input: isBlackBg ? classes.input : "",
              },
              style: {
                background: isBlackBg ? "#2A2D34" : "",
                color: isBlackBg ? "#fff" : "",
              },
              endAdornment: (
                <InputAdornment position="end">
                  <DateRange />
                </InputAdornment>
              ),
            }}
            className={`${isFormEdit ? "custom_textfield" : ""}`}
          />
        )
      }}
      disableDayPicker
      plugins={[<TimePickerPlugin disablePreview />]}
      format="HH:mm"
      value={getValue()}
      onChange={(date) => {
        onChange(date?.isValid ? date.format("HH:mm") : "")
      }}
    />
  )
}

export default CTimePicker
