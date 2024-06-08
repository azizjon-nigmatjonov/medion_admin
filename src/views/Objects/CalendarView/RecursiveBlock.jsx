import { useState } from "react";
import { useMemo } from "react";

import DataColumn from "./DataColumn";
import MockColumn from "./MockColumn";
import styles from "./style.module.scss";

const RecursiveBlock = ({ date, data, fieldsMap, parentTab, view, tabs, level = 0, workingDays }) => {
  const elements = useMemo(() => {
    const computedElements = [];

    getChildrenList(parentTab, tabs, level)?.forEach((tab) => {
      const childrens = getChildrenList(tab, tabs, level + 1);

      if (!(childrens?.length || level !== 0 || tabs.length !== 2)) return;
      else {
        computedElements.push({
          ...tab,
          childrenNumber: childrens?.length,
        });
      }
    });

    return computedElements;
  }, [parentTab, tabs, level]);

  if (!elements?.length) return <MockColumn view={view} level={level} tabs={tabs} />;

  return (
    <div className={styles.row}>
      {elements?.map((tab) => (
        <div className={`${styles.block} ${elements?.length === 1 && level === 1 ? styles.oneElement : ""}`}>
          <div className={`${styles.blockElement}  ${!tabs?.[level + 1] ? styles.last : styles.before} `}>{`${tab.name} ${tab.last_name ?? ""}`}</div>

          {tabs?.[level + 1] ? (
            <RecursiveBlock date={date} data={data} tabs={tabs} parentTab={tab} fieldsMap={fieldsMap} view={view} level={level + 1} workingDays={workingDays} />
          ) : (
            <DataColumn date={date} data={data} parentTab={tab} categoriesTab={parentTab} fieldsMap={fieldsMap} view={view} workingDays={workingDays} />
          )}
        </div>
      ))}
    </div>
  );
};

const getChildrenList = (parentTab, tabs, level) => {
  if (!parentTab) return tabs?.[level]?.list;

  const computedElements = tabs?.[level]?.list?.filter((el) => {
    return Array.isArray(el[parentTab.slug]) ? el[parentTab.slug]?.includes(parentTab.value) : el[parentTab.slug] === parentTab.value;
  });

  return computedElements;
};

export default RecursiveBlock;
