import { add, setHours, setMinutes } from "date-fns";
import { useMemo } from "react";


const useTimeList = (timeInterval = 60) => {
  const timeList = useMemo(() => {
    const startTime = setMinutes(setHours(new Date(), 6), 0);
    const endTime = setMinutes(setHours(new Date(), 23), 0);

    const timeArray = [];

    let currentTime = startTime;
    while (currentTime <= endTime) {
      timeArray.push(currentTime);
      currentTime = add(currentTime, { minutes: timeInterval });
    }

    return timeArray;
  }, [ timeInterval ])

  return {
    timeList,
    timeInterval
  }
}

export default useTimeList;