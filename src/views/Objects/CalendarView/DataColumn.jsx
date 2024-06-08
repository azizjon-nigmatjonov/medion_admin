import { Add } from "@mui/icons-material";
import {
  addMinutes,
  differenceInMinutes,
  format,
  parse,
  setHours,
  setMinutes,
} from "date-fns";
import { useEffect, useMemo } from "react";
import {
  Navigate,
  useParams,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import constructorObjectService from "../../../services/constructorObjectService.js";
import useTabRouter from "../../../hooks/useTabRouter";
import useTimeList from "../../../hooks/useTimeList";
import DataCard from "./DataCard";
import styles from "./style.module.scss";
import { useQueryClient } from "react-query";

const DataColumn = ({
  date,
  data,
  categoriesTab,
  parentTab,
  fieldsMap,
  view,
  workingDays,
}) => {
  const { tableSlug } = useParams();
  const [searchParams] = useSearchParams();
  const queryGuid = searchParams.get("guid");
  const querySpecialities = searchParams.get("specialities");
  const queryTableSlug = searchParams.get("tableSlug");
  const querServiceTime = searchParams.get("serviceTime");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { navigateToForm } = useTabRouter();
  const { timeList, timeInterval } = useTimeList(view.time_interval);

  const elements = useMemo(() => {
    if (!parentTab) return [];
    return data?.filter(
      (el) =>
        el[parentTab.slug] === parentTab.value &&
        el.calendar?.date === format(date, "dd.MM.yyyy")
    );
  }, [parentTab, data, date]);

  const elementsWithPosition = useMemo(() => {
    const calendarStartedTime = setMinutes(setHours(date, 6), 0);

    return elements?.map((el) => {
      const startPosition =
        Math.floor(
          differenceInMinutes(
            el.calendar?.elementFromTime,
            calendarStartedTime
          ) / timeInterval
        ) * 40;

      const height =
        Math.ceil(
          differenceInMinutes(
            el.calendar?.elementToTime,
            el.calendar?.elementFromTime
          ) / timeInterval
        ) * 40;

      return {
        ...el,
        calendar: {
          ...el.calendar,
          startPosition,
          height,
        },
      };
    });
  }, [date, elements, timeInterval]);

  const viewFields = useMemo(() => {
    return view?.columns?.map((id) => fieldsMap[id])?.filter((el) => el);
  }, [fieldsMap, view]);

  const disabledTimes = useMemo(() => {
    if (!workingDays) return null;
    const workingDay = workingDays[format(date, "dd.MM.yyyy")];

    const filteredWorkingDay = workingDay?.find(
      (el) => el[parentTab?.slug] === parentTab?.value
    );

    const calendarStartedTime = setMinutes(setHours(date, 6), 0);

    const startTime = parse(
      filteredWorkingDay?.calendarFromTime,
      "HH:mm",
      date
    );
    const endTime = parse(filteredWorkingDay?.calendarToTime, "HH:mm", date);

    const startIndex = Math.ceil(
      differenceInMinutes(startTime, calendarStartedTime) / timeInterval
    );
    const endIndex =
      Math.floor(
        differenceInMinutes(endTime, calendarStartedTime) / timeInterval
      ) - 1;

    if (isNaN(startIndex) || isNaN(endIndex)) return null;

    return {
      startIndex,
      endIndex,
    };
  }, [workingDays, date, parentTab, timeInterval]);

  const isDisabled = (index) => {
    if (!view?.disable_dates?.day_slug) return false;

    if (!disabledTimes?.startIndex || !disabledTimes?.endIndex) return true;

    return index < disabledTimes?.startIndex || index > disabledTimes?.endIndex;
  };

  const navigateToCreatePage = async (time) => {
    const hour = Number(format(time, "H"));
    const minute = Number(format(time, "m"));
    const computedDate = await setHours(setMinutes(date, minute), hour);
    if (queryTableSlug) {
      await constructorObjectService.update(queryTableSlug, {
        data: {
          guid: queryGuid,
          doctors_id: parentTab?.guid,
          date_start: computedDate,
          time_end: addMinutes(new Date(computedDate), querServiceTime),
          specialities_id: querySpecialities,
        },
      });

      queryClient.refetchQueries(["GET_OBJECT_LIST", queryTableSlug]);
      navigate(-1);
    } else {
      const startTimeStampSlug = view?.calendar_from_slug;
      navigateToForm(tableSlug, "CREATE", null, {
        [startTimeStampSlug]: computedDate,
        [parentTab?.slug]: parentTab?.value,
        specialities_id: categoriesTab?.value,
      });
    }
  };

  const navigateToEditPage = (el) => {
    navigateToForm(tableSlug, "EDIT", el, {
      [parentTab?.slug]: parentTab?.value,
    });
  };

  return (
    <div className={styles.objectColumn}>
      {timeList.map((time, index) => (
        <div
          key={time}
          className={`${styles.timeBlock} ${
            isDisabled(index) ? styles.disabled : ""
          }`}
          style={{ overflow: "auto" }}
        >
          <div className={styles.timePlaceholder}>{format(time, "HH:mm")}</div>

          <div
            className={`${styles.addButton}`}
            onClick={() => navigateToCreatePage(time)}
          >
            <Add color="" />
            {queryGuid ? "Выбрать" : "Создать"}
          </div>
        </div>
      ))}

      {elementsWithPosition?.map((el) => (
        <DataCard
          key={el.id}
          date={date}
          view={view}
          fieldsMap={fieldsMap}
          data={el}
          viewFields={viewFields}
          navigateToEditPage={navigateToEditPage}
        />
      ))}
    </div>
  );
};

export default DataColumn;
