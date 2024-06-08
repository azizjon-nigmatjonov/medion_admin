
import { format, isValid, parse, parseISO } from 'date-fns';


const dateFormats = {
  "DATE": 'dd.MM.yyyy',
  "DATE_TIME": 'dd.MM.yyyy HH:mm',
  "TIME": 'HH:mm',
}

export const formatDate = (value, type = "DATE") => {
if(!value) {
  return ''
} else {
  const parsedDate = parseISO(value);

  const isValidDate = isValid(parsedDate);
  if(isValidDate) return format(parsedDate, dateFormats[type])
}
}
