




import { Calendar } from "react-multi-date-picker"
import weekends from "react-multi-date-picker/plugins/highlight_weekends"
import "react-multi-date-picker/styles/layouts/mobile.css"
import { locale } from "./Plugins/locale"
import "./style2.scss"
import CustomNavButton from "./Plugins/CustomNavButton"
import './style2.scss'

const CCalendar = ({ value, onChange }) => {

  return (
    <div className="Calendar" >
    <Calendar
      renderButton={<CustomNavButton />}
      plugins={[weekends()]}
      weekStartDayIndex={1}
      portal
      locale={locale}
      className="datePicker"
      format="DD.MM.YYYY"
      value={value}
      onChange={(val) => val?.length ? onChange(val.map(el => new Date(el))) : onChange([])}
    />
    </div>
  )
}

export default CCalendar
