import { useCallback, useEffect, useMemo, useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import CreateButton from "../../components/Buttons/CreateButton";
import RectangleIconButton from "../../components/Buttons/RectangleIconButton";
import FiltersBlock from "../../components/FiltersBlock";
import TableCard from "../../components/TableCard";
import useTabRouter from "../../hooks/useTabRouter";
import ViewTabSelector from "./components/ViewTypeSelector";
import TableView from "./TableView";
import style from "./style.module.scss";
import TreeView from "./TreeView";
import SettingsButton from "./components/ViewSettings/SettingsButton";
import { useParams } from "react-router-dom";
import constructorObjectService from "../../services/constructorObjectService";
import { getRelationFieldTabsLabel } from "../../utils/getRelationFieldLabel";
import { CircularProgress } from "@mui/material";
import { useMutation, useQuery } from "react-query";
import useFilters from "../../hooks/useFilters";
import FastFilterButton from "./components/FastFilter/FastFilterButton";
import { useDispatch, useSelector } from "react-redux";
import { CheckIcon } from "../../assets/icons/icon";
import { tableSizeAction } from "../../store/tableSize/tableSizeSlice";
import PermissionWrapperV2 from "../../components/PermissionWrapper/PermissionWrapperV2";
import ExcelButtons from "./components/ExcelButtons";
import FormatLineSpacingIcon from "@mui/icons-material/FormatLineSpacing";
import MultipleInsertButton from "./components/MultipleInsertForm";
import CustomActionsButton from "./components/CustomActionsButton";
import { Clear, Description, Edit, Save } from "@mui/icons-material";
import { useFieldArray, useForm } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import FinancialCalendarView from "./FinancialCalendarView/FinancialCalendarView";
import CRangePickerNew from "../../components/DatePickers/CRangePickerNew";
import { endOfMonth, startOfMonth } from "date-fns";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Menu from "@mui/material/Menu";

const ViewsWithGroups = ({
  views,
  selectedTabIndex,
  setSelectedTabIndex,
  view,
  fieldsMap,
}) => {
  const { tableSlug } = useParams();
  const dispatch = useDispatch();
  const { filters } = useFilters(tableSlug, view.id);
  const tableHeight = useSelector((state) => state.tableSize.tableHeight);
  const [shouldGet, setShouldGet] = useState(false);
  const [heightControl, setHeightControl] = useState(false);
  const [analyticsRes, setAnalyticsRes] = useState(null)
  const [isFinancialCalendarLoading, setIsFinancialCalendarLoading] = useState(false)
  const [res, setRes] = [{
    balance: []
  }]
  const { navigateToForm } = useTabRouter();
  const [dataLength, setDataLength] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedObjects, setSelectedObjects] = useState([]);

  const [dateFilters, setDateFilters] = useState({
    $gte: startOfMonth(new Date()),
    $lt: endOfMonth(new Date()),
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const tableHeightOptions = [
    {
      label: "Small",
      value: "small",
    },
    {
      label: "Medium",
      value: "medium",
    },
    {
      label: "Large",
      value: "large",
    },
  ];

  const {
    control,
    reset,
    handleSubmit,
    watch,
    setValue: setFormValue,
  } = useForm({
    defaultValues: {
      multi: [],
    },
  });

  const { fields, remove, append } = useFieldArray({
    control,
    name: "multi",
  });

  const getValue = useCallback((item, key) => {
    return typeof item?.[key] === "object" ? item?.[key].value : item?.[key];
  }, []);

  const { mutate: updateMultipleObject, isLoading } = useMutation(
    (values) =>
      constructorObjectService.updateMultipleObject(tableSlug, {
        data: {
          objects: values.multi.map((item) => ({
            ...item,
            guid: item?.guid ?? "",
            doctors_id_2: getValue(item, "doctors_id_2"),
            doctors_id_3: getValue(item, "doctors_id_3"),
            specialities_id: getValue(item, "specialities_id"),
          })),
        },
      }),
    {
      onSuccess: () => {
        setShouldGet((p) => !p);
        setFormVisible(false);
      },
    }
  );

  const onSubmit = (data) => {
    updateMultipleObject(data);
  };

  const handleHeightControl = (val) => {
    dispatch(
      tableSizeAction.setTableHeight({
        tableHeight: val,
      })
    );
    setHeightControl(false);
  };

  const navigateToCreatePage = () => {
    navigateToForm(tableSlug);
  };

  function dateIsValid(date) {
    return date instanceof Date && !isNaN(date);
  }

  const groupFieldId = view?.group_fields?.[0];
  const groupField = fieldsMap[groupFieldId];

  const { data: tabs, isLoading: loader } = useQuery(
    queryGenerator(groupField, filters)
  );

  useEffect(() => {
    if (view?.type === "FINANCE CALENDAR" && dateIsValid(dateFilters?.$lt)) {
      setIsFinancialCalendarLoading(true)
      constructorObjectService
        .getFinancialAnalytics(tableSlug, {
          data: {
            start: dateFilters?.$gte,
            end: dateFilters?.$lt,
            view_id: view?.id,
          },
        })
        .then((res) => {
          setAnalyticsRes(res.data)
        }).finally(() => setIsFinancialCalendarLoading(false));
    }
  }, [dateFilters, tableSlug]);

  return (
    <>
      <FiltersBlock
        extra={
          <>
            {view.type === "TABLE" && (
              <RectangleIconButton
                color="white"
                onClick={() => setHeightControl(!heightControl)}
              >
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <FormatLineSpacingIcon color="primary" />
                  </span>
                  {heightControl && (
                    <div className={style.heightControl}>
                      {tableHeightOptions.map((el) => (
                        <div
                          key={el.value}
                          className={style.heightControl_item}
                          onClick={() => handleHeightControl(el.value)}
                        >
                          {el.label}
                          {tableHeight === el.value ? (
                            <CheckIcon color="primary" />
                          ) : null}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </RectangleIconButton>
            )}

            <FastFilterButton view={view} fieldsMap={fieldsMap} />

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
              <div className={style.menuBar}>
                <ExcelButtons fieldsMap={fieldsMap} />
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
                  <span>template</span>
                </div>
                <PermissionWrapperV2 tabelSlug={tableSlug} type="update">
                  <SettingsButton />
                </PermissionWrapperV2>
              </div>
            </Menu>
          </>
        }
      >
        <ViewTabSelector
          selectedTabIndex={selectedTabIndex}
          setSelectedTabIndex={setSelectedTabIndex}
          views={views}
        />
        {view?.type === "FINANCE CALENDAR" && (
          <CRangePickerNew onChange={setDateFilters} value={dateFilters} />
        )}
      </FiltersBlock>

      <Tabs direction={"ltr"} defaultIndex={0}>
        <TableCard type="withoutPadding">
          <div className={style.tableCardHeader}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div className="title" style={{ marginRight: "20px" }}>
                <h3>{view.table_label}</h3>
              </div>
              <TabList style={{ border: "none" }}>
                {tabs?.map((tab) => (
                  <Tab key={tab.value}>{tab.label}</Tab>
                ))}
              </TabList>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <PermissionWrapperV2 tabelSlug={tableSlug} type="write">
                <RectangleIconButton
                  color="success"
                  size="small"
                  onClick={navigateToCreatePage}
                >
                  <AddIcon style={{ color: "#007AFF" }} />
                </RectangleIconButton>
                {formVisible ? (
                  <>
                    <RectangleIconButton
                      color="success"
                      size="small"
                      onClick={handleSubmit(onSubmit)}
                      loader={isLoading}
                    >
                      <Save color="success" />
                    </RectangleIconButton>
                    <RectangleIconButton
                      color="error"
                      onClick={() => {
                        setFormVisible(false);
                        if (fields.length > dataLength) {
                          remove(
                            Array(fields.length - dataLength)
                              .fill("*")
                              .map((i, index) => fields.length - (index + 1))
                          );
                        }
                      }}
                    >
                      <Clear color="error" />
                    </RectangleIconButton>
                  </>
                ) : (
                  <PermissionWrapperV2 tableSlug={tableSlug} type="update">
                    <RectangleIconButton
                      color="success"
                      className=""
                      size="small"
                      onClick={() => {
                        setFormVisible(true);
                        // reset()
                      }}
                    >
                      <Edit color="primary" />
                    </RectangleIconButton>
                  </PermissionWrapperV2>
                )}
                <MultipleInsertButton
                  view={view}
                  fieldsMap={fieldsMap}
                  tableSlug={tableSlug}
                />
                <CustomActionsButton
                  selectedObjects={selectedObjects}
                  setSelectedObjects={setSelectedObjects}
                  tableSlug={tableSlug}
                />
              </PermissionWrapperV2>
            </div>
          </div>
          {/* <>
            {view.type === "TREE" ? (
              <TreeView
                filters={filters}
                filterChangeHandler={filterChangeHandler}
                view={view}
              />
            ) : (
              <TableView
                filters={filters}
                filterChangeHandler={filterChangeHandler}
              />
            )}
          </> */}
          {loader ? (
            <div className={style.loader}>
              <CircularProgress />
            </div>
          ) : (
            <>
              {tabs?.map((tab) => (
                <TabPanel key={tab.value}>
                  {view.type === "TREE" ? (
                    <TreeView
                      tableSlug={tableSlug}
                      filters={filters}
                      view={view}
                      fieldsMap={fieldsMap}
                      tab={tab}
                    />
                  ) : view?.type === "FINANCE CALENDAR" ? (
                    <FinancialCalendarView
                      view={view}
                      filters={filters}
                      fieldsMap={fieldsMap}
                      tab={tab}
                      isLoading={isFinancialCalendarLoading}
                      financeDate={analyticsRes?.response || []}
                      financeTotal={analyticsRes?.total_amount || []}
                      totalBalance={analyticsRes?.balance}
                    />
                  ) : (
                    <TableView
                      control={control}
                      setFormVisible={setFormVisible}
                      formVisible={formVisible}
                      filters={filters}
                      view={view}
                      fieldsMap={fieldsMap}
                      tab={tab}
                      selectedObjects={selectedObjects}
                      setSelectedObjects={setSelectedObjects}
                    />
                  )}
                </TabPanel>
              ))}

              {!tabs?.length && (
                <>
                  {view.type === "TREE" ? (
                    <TreeView
                      tableSlug={tableSlug}
                      filters={filters}
                      view={view}
                      fieldsMap={fieldsMap}
                    />
                  ) : view?.type === "FINANCE CALENDAR" ? (
                    <FinancialCalendarView
                      control={control}
                      view={view}
                      filters={filters}
                      fieldsMap={fieldsMap}
                      isLoading={isFinancialCalendarLoading}
                      financeDate={analyticsRes?.response || []}
                      financeTotal={analyticsRes?.total_amount || []}
                      totalBalance={analyticsRes?.balance || []}
                    />
                  ) : (
                    <TableView
                      setDataLength={setDataLength}
                      shouldGet={shouldGet}
                      reset={reset}
                      fields={fields}
                      setFormValue={setFormValue}
                      control={control}
                      setFormVisible={setFormVisible}
                      formVisible={formVisible}
                      filters={filters}
                      view={view}
                      fieldsMap={fieldsMap}
                      selectedObjects={selectedObjects}
                      setSelectedObjects={setSelectedObjects}
                    />
                  )}
                </>
              )}
            </>
          )}
        </TableCard>
      </Tabs>
    </>
  );
};

const queryGenerator = (groupField, filters = {}) => {
  if (!groupField)
    return {
      queryFn: () => {},
    };

  const filterValue = filters[groupField.slug];
  const computedFilters = filterValue ? { [groupField.slug]: filterValue } : {};

  if (groupField?.type === "PICK_LIST" || groupField?.type === "MULTISELECT") {
    return {
      queryKey: ["GET_GROUP_OPTIONS", groupField.id],
      queryFn: () =>
        groupField?.attributes?.options?.map((el) => ({
          label: el?.label ?? el.value,
          value: el?.value,
          slug: groupField?.slug,
        })),
    };
  }

  if (groupField?.type === "LOOKUP" || groupField?.type === "LOOKUPS") {
    const queryFn = () =>
      constructorObjectService.getList(groupField.table_slug, {
        data: computedFilters ?? {},
      });

    return {
      queryKey: [
        "GET_OBJECT_LIST_ALL",
        { tableSlug: groupField.table_slug, filters: computedFilters },
      ],
      queryFn,
      select: (res) =>
        res?.data?.response?.map((el) => ({
          label: getRelationFieldTabsLabel(groupField, el),
          value: el.guid,
          slug: groupField?.slug,
        })),
    };
  }
};

export default ViewsWithGroups;
