import { format, isValid } from "date-fns"



export const dateValidFormat = (date, formatString) => {
  
  if(!date) return ''
  

  if(!isValid(new Date(date))) return ''

  return format(new Date(date), formatString)
}