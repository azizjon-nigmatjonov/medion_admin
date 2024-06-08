import { Edit, Save } from "@mui/icons-material"
import { DatePicker } from "@mui/x-date-pickers"
import { IconButton, TextField } from "@mui/material"
import { format } from "date-fns"
import { useState } from "react"
import "./style.scss"

const DateForm = ({ date, onChange = () => {} }) => {
  const [formVisible, setFormVisible] = useState(false)
  const [value, setValue] = useState(new Date(date))

  const saveClickHandler = () => {
    onChange(value)
    setFormVisible(false)
  }

  if (formVisible)
    return (
      <div className="DateForm">
        <DatePicker
          inputFormat="dd.MM.yyyy"
          mask="__.__.____"
          toolbarFormat="dd.MM.yyyy"
          value={value}
          onChange={setValue}
          renderInput={(params) => <TextField {...params} size="small" />}
        />

        <IconButton color="primary" onClick={saveClickHandler} >
          <Save />
        </IconButton>
      </div>
    )

  return (
    <div className="DateForm">
      {value ? format(new Date(value), "dd MMM") : "---"}
      <IconButton color="primary" onClick={() => setFormVisible(true)} >
        <Edit />
      </IconButton>
    </div>
  )
}

export default DateForm
