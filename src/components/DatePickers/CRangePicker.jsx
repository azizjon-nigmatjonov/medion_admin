import ReactDatePicker, { registerLocale } from "react-datepicker"
import ru from 'date-fns/locale/ru';

import "./style.scss"
import RectangleIconButton from "../Buttons/RectangleIconButton";
import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import { add } from "date-fns";

registerLocale('ru', ru)


const CRangePicker = ({ value = [null, null], onChange, interval="weeks" }) => {

  const clickHandler = (number) => {
    if(!value[0] || !value[1]) return
    

    const newValue = [add(value[0], { [interval]: number }), add(value[1], { [interval]: number })]
    onChange(newValue)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }} >

    <RectangleIconButton color="white" onClick={() => clickHandler(-1)} > <ArrowLeft /> </RectangleIconButton>
      <ReactDatePicker
        selected={value[0]}
        onChange={onChange}
        startDate={value[0]}
        endDate={value[1]}
        selectsRange
        showPopperArrow={false}
        dateFormat="dd.MM.yyyy"
        locale="ru"
      />
    <RectangleIconButton color="white" onClick={() => clickHandler(1)} > <ArrowRight /> </RectangleIconButton>
    </div>
  )
}

export default CRangePicker
