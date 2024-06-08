import {
  add,
  differenceInDays,
  endOfWeek,
  format,
  startOfWeek,
} from "date-fns";
import { useMemo, useState } from "react";
import { useQueries, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import CRangePicker from "../../../components/DatePickers/CRangePicker";
import FiltersBlock from "../../../components/FiltersBlock";
import PageFallback from "../../../components/PageFallback";
import useFilters from "../../../hooks/useFilters";
import constructorObjectService from "../../../services/constructorObjectService";
import { getRelationFieldTabsLabel } from "../../../utils/getRelationFieldLabel";
import { listToMap } from "../../../utils/listToMap";
import { selectElementFromEndOfString } from "../../../utils/selectElementFromEnd";
import ExcelButtons from "../components/ExcelButtons";
import FastFilter from "../components/FastFilter";
import FastFilterButton from "../components/FastFilter/FastFilterButton";
import SettingsButton from "../components/ViewSettings/SettingsButton";
import ViewTabSelector from "../components/ViewTypeSelector";
import Calendar from "./Calendar";
import styles from "@/views/Objects/TableView/styles.module.scss";
import style from "./style.module.scss";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Menu from "@mui/material/Menu";
import { Description } from "@mui/icons-material";
import PermissionWrapperV2 from "../../../components/PermissionWrapper/PermissionWrapperV2";

const CalendarView = ({
  view,
  selectedTabIndex,
  setSelectedTabIndex,
  views,
}) => {
  const { tableSlug } = useParams();
  const [dateFilters, setDateFilters] = useState([
    startOfWeek(new Date(), { weekStartsOn: 1 }),
    endOfWeek(new Date(), { weekStartsOn: 1 }),
  ]);
  const [fieldsMap, setFieldsMap] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { filters, dataFilters } = useFilters(tableSlug, view.id);
  const groupFieldIds = view.group_fields;
  const groupFields = groupFieldIds
    .map((id) => fieldsMap[id])
    .filter((el) => el);

  const datesList = useMemo(() => {
    if (!dateFilters?.[0] || !dateFilters?.[1]) return;

    const differenceDays = differenceInDays(dateFilters[1], dateFilters[0]);

    const result = [];
    for (let i = 0; i <= differenceDays; i++) {
      result.push(add(dateFilters[0], { days: i }));
    }
    return result;
  }, [dateFilters]);

  const { data: { data } = { data: [] }, isLoading } = useQuery(
    [
      "GET_OBJECTS_LIST_WITH_RELATIONS",
      { tableSlug, dataFilters, dateFilters },
    ],
    () => {
      return constructorObjectService.getList(tableSlug, {
        data: {
          with_relations: true,
          [view.calendar_from_slug]: {
            $gte: dateFilters[0],
            $lt: dateFilters[1],
          },
          ...dataFilters,
        },
      });
    },
    {
      cacheTime: 10,
      select: (res) => {
        const fields = res.data?.fields ?? [];
        const relationFields =
          res?.data?.relation_fields?.map((el) => ({
            ...el,
            label: `${el.label} (${el.table_label})`,
          })) ?? [];
        const fieldsMap = listToMap([...fields, ...relationFields]);
        const data = res.data?.response?.map((row) => ({
          ...row,
          calendar: {
            date: row[view.calendar_from_slug]
              ? format(new Date(row[view.calendar_from_slug]), "dd.MM.yyyy")
              : null,
            elementFromTime: row[view.calendar_from_slug]
              ? new Date(row[view.calendar_from_slug])
              : null,
            elementToTime: row[view.calendar_to_slug]
              ? new Date(row[view.calendar_to_slug])
              : null,
          },
        }));
        return {
          fieldsMap,
          data,
        };
      },
      onSuccess: (res) => {
        if (Object.keys(fieldsMap)?.length) return;
        setFieldsMap(res.fieldsMap);
      },
    }
  );

  const { data: workingDays } = useQuery(
    ["GET_OBJECTS_LIST", view?.disable_dates?.table_slug, dateFilters],
    () => {
      if (!view?.disable_dates?.table_slug) return {};

      return constructorObjectService.getList(view?.disable_dates?.table_slug, {
        data: {
          [view.disable_dates.day_slug]: {
            $gte: dateFilters[0],
            $lt: dateFilters[1],
          },
        },
      });
    },
    {
      select: (res) => {
        const result = {};

        res?.data?.response?.forEach((el) => {
          const date = el[view?.disable_dates?.day_slug];
          const calendarFromTime = el[view?.disable_dates?.time_from_slug];
          const calendarToTime = el[view?.disable_dates?.time_to_slug];

          if (date) {
            const formattedDate = format(new Date(date), "dd.MM.yyyy");

            if (!result[formattedDate]?.[0]) {
              result[formattedDate] = [
                {
                  ...el,
                  calendarFromTime,
                  calendarToTime,
                },
              ];
            } else {
              result[formattedDate].push({
                ...el,
                calendarFromTime,
                calendarToTime,
              });
            }
          }
        });

        return result;
      },
    }
  );

  const tabResponses = useQueries(queryGenerator(groupFields, filters));
  const tabs = tabResponses?.map((response) => response?.data);
  const tabLoading = tabResponses?.some((response) => response?.isLoading);

  return (
    <div>
      <FiltersBlock
        extra={
          <>
            <FastFilterButton view={view} />

            <button className={style.moreButton} onClick={handleClick}>
              <MoreHorizIcon
                style={{
                  color: "#888",
                }}
              />
            </button>
            <Menu
              open={open}
              onClose={handleClose}
              anchorEl={anchorEl}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    // width: 100,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
            >
              <div className={styles.menuBar}>
                <ExcelButtons />
                <div
                  className={style.template}
                  onClick={() => setSelectedTabIndex(views?.length)}
                >
                  <div
                    className={`${style.element} ${
                      selectedTabIndex === views?.length ? style.active : ""
                    }`}
                  >
                    <Description
                      className={style.icon}
                      style={{ color: "#6E8BB7" }}
                    />
                  </div>
                  <span>Template</span>
                </div>
                <PermissionWrapperV2 tableSlug={tableSlug} type="update">
                  <SettingsButton />
                </PermissionWrapperV2>
              </div>
            </Menu>
            {/* <ExcelButtons />

            <SettingsButton /> */}
          </>
        }
      >
        <ViewTabSelector
          selectedTabIndex={selectedTabIndex}
          setSelectedTabIndex={setSelectedTabIndex}
          views={views}
        />
        <CRangePicker value={dateFilters} onChange={setDateFilters} />
      </FiltersBlock>
      <div
        className="title"
        style={{
          padding: "10px",
          background: "#fff",
          borderBottom: "1px solid #E5E9EB",
        }}
      >
        <h3>{view.table_label}</h3>
      </div>
      {isLoading || tabLoading ? (
        <PageFallback />
      ) : (
        <div className={styles.wrapper}>
          <div className={styles.filters}>
            <p>Фильтры</p>
            <FastFilter view={view} fieldsMap={fieldsMap} isVertical />
          </div>

          <Calendar
            data={data}
            fieldsMap={fieldsMap}
            datesList={datesList}
            view={view}
            tabs={tabs}
            workingDays={workingDays}
          />
        </div>
      )}
    </div>
  );
};

// ========== UTILS==========

const queryGenerator = (groupFields, filters = {}) => {
  return groupFields?.map((field) => promiseGenerator(field, filters));
};

const promiseGenerator = (groupField, filters = {}) => {
  const filterValue = filters[groupField.slug] ?? filters;
  const defaultFilters = filterValue ? { [groupField.slug]: filterValue } : {};
  const relationFilters = {};

  Object.entries(filters)?.forEach(([key, value]) => {
    if (!key?.includes(".")) return;

    const filterTableSlug = selectElementFromEndOfString({
      string: key,
      separator: ".",
      index: 2,
    });

    const slug = key.split(".")?.pop();

    if (filterTableSlug === groupField.table_slug) {
      const slug = key.split(".")?.pop();
      relationFilters[slug] = value;
    } else {
      if (groupField.slug === slug) {
        const slug = key.split(".")?.pop();
        relationFilters[slug] = value;
      }
    }
  });

  const objectSlug = Object.keys(filters)?.[0]?.split(".").pop();
  const slugValue = Object.values(filters)?.[0];
  const computedFilters = { ...defaultFilters, ...relationFilters };
  const computedFilterValue = { [objectSlug]: slugValue };
  if (groupField?.type === "PICK_LIST") {
    return {
      queryKey: ["GET_GROUP_OPTIONS", groupField.id],
      queryFn: () => ({
        id: groupField.id,
        list: groupField.attributes?.options?.map((el) => ({
          ...el,
          label: el,
          value: el,
          slug: groupField?.slug,
        })),
      }),
    };
  }

  if (groupField?.type === "LOOKUP" || groupField?.type === "LOOKUPS") {
    const queryFn = () =>
      constructorObjectService.getList(
        groupField?.type === "LOOKUP"
          ? groupField.slug?.slice(0, -3)
          : groupField.slug?.slice(0, -4),
        {
          data: computedFilterValue,
        }
      );

    return {
      queryKey: [
        "GET_OBJECT_LIST_ALL",
        {
          tableSlug:
            groupField?.type === "LOOKUP"
              ? groupField.slug?.slice(0, -3)
              : groupField.slug?.slice(0, -4),
          filters: computedFilters,
        },
      ],
      queryFn,
      select: (res) => ({
        id: groupField.id,
        list: res.data?.response?.map((el) => ({
          ...el,
          label: getRelationFieldTabsLabel(groupField, el),
          value: el.guid,
          slug: groupField?.slug,
        })),
      }),
    };
  }
};

export default CalendarView;
