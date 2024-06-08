import CRangePickerNew from "../../../../components/DatePickers/CRangePickerNew"

const DateFilter = ({ onChange, value }) => {
  return (
    <>
      <CRangePickerNew value={value} onChange={onChange} />
    </>
  )
}

export default DateFilter
