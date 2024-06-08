import { add, endOfWeek, format, startOfWeek } from "date-fns";

const monthsData = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

export const calculateGantCalendarYears = (dateList) => {
  const result = {};

  dateList.forEach((date) => {
    const year = format(date, "yyyy");

    if (!result[year]) result[year] = [date];
    else {
      if (!result[year].some((i) => i.getMonth() === date.getMonth())) {
        result[year].push(date);
      }
    }
  });

  return Object.entries(result);
};

export const calculateGantCalendarMonths = (dateList) => {
  const result = {};

  dateList.forEach((date) => {
    const month = format(date, "MMMM");

    if (!result[month]) result[month] = [date];
    else result[month].push(date);
  });
  return Object.entries(result);
};

export const calculateGantCalendarWeeks = (dateList) => {
  const result = {};

  dateList.forEach((date) => {
    const startDate = startOfWeek(date, { weekStartsOn: 1 });
    const endDate = endOfWeek(date, { weekStartsOn: 1 });

    const isInRange = endDate <= date && endDate >= date;

    const weekDisplayTitle = `${format(startDate, "dd MMMM")} - ${format(
      endDate,
      "dd MMMM"
    )}`;

    if (!isInRange && !result[weekDisplayTitle])
      result[weekDisplayTitle] = [date];
    else result[weekDisplayTitle].push(date);
  });

  return Object.entries(result);
};
