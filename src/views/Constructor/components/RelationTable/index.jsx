import { useState } from "react";
import { useMemo } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import DataTable from "../../../../components/DataTable";
import FRow from "../../../../components/FormElements/FRow";
import constructorObjectService from "../../../../services/constructorObjectService";
import { listToMap } from "../../../../utils/listToMap";
import { Filter } from "../../../Objects/components/FilterGenerator";
import styles from "./style.module.scss";

const RelationTable = ({ relation = {} }) => {
  const { slug } = useParams();
  const [filters, setFilters] = useState([]);

  const filterChangeHandler = (value, name) => {
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const computedRelation = useMemo(() => {
    return {
      ...relation,
      relatedTable:
        relation.table_to?.slug === slug
          ? relation.table_from
          : relation.table_to,
    };
  }, [relation, slug]);

  const relatedTableSlug = computedRelation?.relatedTable?.slug;

  const { data: fieldsMap = {}, isLoading: dataFetchingLoading } = useQuery(
    ["GET_VIEW_RELATION_FIELDS", relatedTableSlug],
    () => {
      if (!relatedTableSlug) return null;
      return constructorObjectService.getList(relatedTableSlug, {
        data: { limit: 0, offset: 0 },
      });
    },
    {
      select: (res) => {
        return listToMap(res.data?.fields);
        // return res?.data?.fields ?? []
      },
    }
  );

  const computedColumns = useMemo(() => {
    return relation.columns?.map((id) => fieldsMap[id])?.filter((el) => el);
  }, [relation.columns, fieldsMap]);

  const computedFilters = useMemo(() => {
    return relation.quick_filters
      ?.map(({ field_id }) => fieldsMap[field_id])
      ?.filter((el) => el);
  }, [relation.quick_filters, fieldsMap]);

  return (
    <div className={styles.relationTable}>
      <div className={styles.filtersBlock}>
        {computedFilters?.map((field) => (
          <FRow key={field.id} label={field.label}>
            <Filter
              field={field}
              name={field.slug}
              tableSlug={relatedTableSlug}
              filters={filters}
              onChange={filterChangeHandler}
            />
          </FRow>
        ))}
      </div>

      <div className={styles.tableBlock}>
        <DataTable
          loader={dataFetchingLoading}
          data={[]}
          columns={computedColumns}
          removableHeight={255}
          disableFilters
        />
      </div>
    </div>
  );
};

export default RelationTable;
