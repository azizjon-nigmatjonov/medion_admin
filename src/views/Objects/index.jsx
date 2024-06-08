import { Fragment, useEffect, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { TabPanel, Tabs } from "react-tabs";
import ViewsWithGroups from "./ViewsWithGroups";
import BoardView from "./BoardView";
import CalendarView from "./CalendarView";
import { useQuery } from "react-query";
import PageFallback from "../../components/PageFallback";
import constructorObjectService from "../../services/constructorObjectService";
import { listToMap } from "../../utils/listToMap";
import FiltersBlock from "../../components/FiltersBlock";
import CalendarHourView from "./CalendarHourView";
import ViewTabSelector from "./components/ViewTypeSelector";
import styles from "./style.module.scss";
import DocView from "./DocView";
import GanttView from "./GanttView";

const ObjectsPage = () => {
  const { tableSlug, appId } = useParams();
  const { state } = useLocation();
  const [searchParams] = useSearchParams();
  const queryTab = searchParams.get("view");

  const [selectedTabIndex, setSelectedTabIndex] = useState(1);

  const {
    data: { views, fieldsMap } = {
      views: [],
      fieldsMap: {},
    },
    isLoading,
  } = useQuery(
    ["GET_VIEWS_AND_FIELDS", tableSlug],
    () => {
      return constructorObjectService.getList(tableSlug, {
        data: { limit: 0, offset: 0, app_id: appId },
      });
    },
    {
      select: ({ data }) => {
        return {
          views: data?.views ?? [],
          fieldsMap: listToMap(data?.fields),
        };
      },
      onSuccess: ({ views }) => {
        if (state?.toDocsTab) setSelectedTabIndex(views?.length);
      },
    }
  );
  useEffect(() => {
    queryTab
      ? setSelectedTabIndex(parseInt(queryTab - 1))
      : setSelectedTabIndex(0);
  }, [queryTab]);

  const setViews = () => {};
  if (isLoading) return <PageFallback />;
  return (
    <>
      <Tabs direction={"ltr"} selectedIndex={selectedTabIndex}>
        <div>
          {views.map((view) => {
            return (
              <TabPanel key={view.id}>
                {view.type === "BOARD" ? (
                  <>
                    <BoardView
                      view={view}
                      setViews={setViews}
                      selectedTabIndex={selectedTabIndex}
                      setSelectedTabIndex={setSelectedTabIndex}
                      views={views}
                      fieldsMap={fieldsMap}
                    />
                  </>
                ) : view.type === "CALENDAR" ? (
                  <>
                    <CalendarView
                      view={view}
                      setViews={setViews}
                      selectedTabIndex={selectedTabIndex}
                      setSelectedTabIndex={setSelectedTabIndex}
                      views={views}
                      fieldsMap={fieldsMap}
                    />
                  </>
                ) : view.type === "CALENDAR HOUR" ? (
                  <>
                    <CalendarHourView
                      view={view}
                      setViews={setViews}
                      selectedTabIndex={selectedTabIndex}
                      setSelectedTabIndex={setSelectedTabIndex}
                      views={views}
                      fieldsMap={fieldsMap}
                    />
                  </>
                ) : view.type === "GANTT" ? (
                  <>
                    <GanttView
                      view={view}
                      setViews={setViews}
                      selectedTabIndex={selectedTabIndex}
                      setSelectedTabIndex={setSelectedTabIndex}
                      views={views}
                      fieldsMap={fieldsMap}
                    />
                  </>
                ) : (
                  <>
                    <ViewsWithGroups
                      selectedTabIndex={selectedTabIndex}
                      setSelectedTabIndex={setSelectedTabIndex}
                      views={views}
                      view={view}
                      fieldsMap={fieldsMap}
                    />
                  </>
                )}
              </TabPanel>
            );
          })}
          <TabPanel>
            <DocView
              views={views}
              fieldsMap={fieldsMap}
              selectedTabIndex={selectedTabIndex}
              setSelectedTabIndex={setSelectedTabIndex}
            />
          </TabPanel>
        </div>
      </Tabs>

      {!views?.length && (
        <FiltersBlock>
          <ViewTabSelector
            selectedTabIndex={selectedTabIndex}
            setSelectedTabIndex={setSelectedTabIndex}
            views={views}
          />
        </FiltersBlock>
      )}
    </>
  );
};

export default ObjectsPage;
