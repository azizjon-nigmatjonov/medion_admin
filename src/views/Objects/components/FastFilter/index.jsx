import { useMemo, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import useFilters from "../../../../hooks/useFilters";
import { filterActions } from "../../../../store/filter/filter.slice";
import { Filter } from "../FilterGenerator";
import styles from "./style.module.scss";

const FastFilter = ({ view, fieldsMap, isVertical = false }) => {
  const { tableSlug } = useParams();
  const { new_list } = useSelector((state) => state.filter);
  const [queryParameters] = useSearchParams();

  useEffect(() => {
    if (queryParameters.get("specialities")?.length) {
      dispatch(
        filterActions.setFilter({
          tableSlug: tableSlug,
          viewId: view.id,
          name: "specialities_id",
          value: [`${queryParameters.get("specialities")}`],
        })
      );
    }
  }, [queryParameters]);

  const dispatch = useDispatch();

  const { filters } = useFilters(tableSlug, view.id);

  const computedFields = useMemo(() => {
    return (
      [
        ...view?.quick_filters,
        ...(new_list[tableSlug] ?? [])
          ?.filter((fast) => fast.checked && !view.quick_filters.find((quick) => quick.field_id === fast.id))
          ?.map((fast) => ({ field_id: fast.id, default_value: "" })),
      ]
        ?.map((el) => fieldsMap[el?.field_id])
        ?.filter((el) => el) ?? []
    );
  }, [view?.quick_filters, fieldsMap, new_list, tableSlug]);

  const onChange = (value, name) => {
    dispatch(
      filterActions.setFilter({
        tableSlug: tableSlug,
        viewId: view.id,
        name,
        value,
      })
    );
  };

  return (
    <div className={styles.filtersBlock} style={{ flexDirection: isVertical ? "column" : "row" }}>
      {computedFields?.map((filter) => (
        <div className={styles.filter} key={filter.id}>
          <Filter field={filter} name={filter?.path_slug ?? filter.slug} tableSlug={tableSlug} filters={filters} onChange={onChange} />
        </div>
      ))}
    </div>
  );
};

export default FastFilter;
