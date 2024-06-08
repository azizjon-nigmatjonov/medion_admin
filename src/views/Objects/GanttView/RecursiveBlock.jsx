import { Fragment, useMemo } from "react";
import DataRow from "./DataRow";
import styles from "./style.module.scss";

const RecursiveBlock = ({
  data,
  period,
  fieldsMap,
  parentTab,
  view,
  tabs,
  level = 0,
  datesList,
}) => {
  const elements = useMemo(() => {
    if (!parentTab)
      return tabs?.[level]?.list.filter((p) =>
        tabs[1]?.list.some((c) => c.cabinets_id === p.value)
      );
    return tabs?.[level]?.list?.filter((el) => {
      return Array.isArray(el[parentTab.slug])
        ? el[parentTab.slug]?.includes(parentTab.value)
        : el[parentTab.slug] === parentTab.value;
    });
  }, [parentTab, tabs, level]);

  const rowWidth = datesList?.length * 160 + 200;

  return (
    <div className={styles.recursiveBlock}>
      {elements?.map((tab) => (
        <Fragment key={tab.id}>
          {tabs?.[level + 1] ? (
            <div className={styles.row} style={{ width: rowWidth }}>
              <div className={`${styles.tabBlock} ${styles.parent}`}>
                {tab.desc || tab.label}
              </div>
            </div>
          ) : (
            <DataRow
              period={period}
              tab={tab}
              datesList={datesList}
              view={view}
              fieldsMap={fieldsMap}
              data={data}
            />
          )}

          {tabs?.[level + 1] && (
            <RecursiveBlock
              period={period}
              data={data}
              tabs={tabs}
              parentTab={tab}
              fieldsMap={fieldsMap}
              view={view}
              level={level + 1}
              datesList={datesList}
            />
          )}
        </Fragment>
      ))}
    </div>
  );
};

export default RecursiveBlock;
