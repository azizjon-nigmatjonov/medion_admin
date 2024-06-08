import { Fragment, useMemo } from "react";
import DataRow from "./DataRow";
import styles from "./style.module.scss";

const RecursiveBlock = ({
  data,
  fieldsMap,
  parentTab,
  view,
  tabs,
  level = 0,
  datesList,
}) => {

  const elements = useMemo(() => {
    // if (!parentTab)
    // return  tabs[level]?.list.filter((c) => c?.doctors_ids && c?.doctors_ids?.length > 0)    

    if (!parentTab) return tabs?.[level]?.list;
    return tabs?.[level]?.list?.filter((el) => {
      return Array.isArray(el[parentTab.slug])
        ? el[parentTab.slug]?.includes(parentTab.value)
        : el[parentTab.slug] === parentTab.value;
    });
  }, [parentTab, tabs, level]);

  const rowWidth = datesList?.length * 160 + 200;
  
  return (
    <div>
      {elements?.map((tab) => (
        <Fragment key={tab.id}>
          {tabs?.[level + 1] ? (
            <div className={styles.row} style={{ width: rowWidth }}>
              <div className={`${styles.tabBlock} ${styles.parent}`}>
                {tab.label}
              </div>
            </div>
          ) : (
            <DataRow
              tab={tab}
              datesList={datesList}
              view={view}
              fieldsMap={fieldsMap}
              data={data}
            />
          )}

          {tabs?.[level + 1] && (
            <RecursiveBlock
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
