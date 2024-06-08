import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";

import SecondaryButton from "../../../components/Buttons/SecondaryButton";
import FRow from "../../../components/FormElements/FRow";
import useTabRouter from "../../../hooks/useTabRouter";
import constructorObjectService from "../../../services/constructorObjectService";
import { listToMap } from "../../../utils/listToMap";
import { objectToArray } from "../../../utils/objectToArray";
import { pageToOffset } from "../../../utils/pageToOffset";
import { Filter } from "../components/FilterGenerator";
import styles from "./style.module.scss";
import ObjectDataTable from "../../../components/DataTable/ObjectDataTable";
import useCustomActionsQuery from "../../../queries/hooks/useCustomActionsQuery";
import { useSelector } from "react-redux";

const RelationTable = forwardRef(
  (
    {
      setDataLength,
      relation,
      shouldGet,
      createFormVisible,
      remove,
      setCreateFormVisible,
      watch,
      selectedObjects,
      setSelectedObjects,
      tableSlug,
      setFieldSlug,
      id,
      reset,
      selectedTabIndex,
      control,
      setFormValue,
      fields,
      setFormVisible,
      formVisible,
    },
    ref
  ) => {
    const { appId } = useParams();
    const navigate = useNavigate();
    const { navigateToForm } = useTabRouter();
    const tableRef = useRef(null);
    const [filters, setFilters] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState();
    const isPermissions = useSelector((state) => state?.auth?.permissions);
    const filterChangeHandler = (value, name) => {
      setFilters({
        ...filters,
        [name]: value ?? undefined,
      });
    };

    const onCheckboxChange = (val, row) => {
      if (val) setSelectedObjects((prev) => [...prev, row.guid]);
      else setSelectedObjects((prev) => prev.filter((id) => id !== row.guid));
    };
    const onChecked = (id) => {
      setSelectedObjects((prev) => {
        if (prev.includes(id)) {
          return prev.filter((item) => item !== id);
        } else {
          return [...prev, id];
        }
      });
    };

    const computedFilters = useMemo(() => {
      const relationFilter = {};

      if (relation.type === "Many2Many")
        relationFilter[`${tableSlug}_ids`] = id;
      else if (relation.type === "Many2Dynamic")
        relationFilter[`${relation.relatedTable}.${tableSlug}_id`] = id;
      else relationFilter[`${tableSlug}_id`] = id;

      return {
        ...filters,
        ...relationFilter,
      };
    }, [filters, tableSlug, id, relation.type, relation.relatedTable]);

    //============VIEW PERMISSION=========
    const viewPermission = useMemo(() => {
      if (relation.permission.view_permission) return true;
      else return false;
    }, [relation.permission.view_permission]);

    const relatedTableSlug = relation?.relatedTable;
    const {
      data: {
        tableData = [],
        pageCount = 1,
        columns = [],
        quickFilters = [],
        fieldsMap = {},
      } = {},
      isLoading: dataFetchingLoading,
    } = useQuery(
      [
        "GET_OBJECT_LIST",
        relatedTableSlug,
        shouldGet,
        appId,
        {
          filters: computedFilters,
          offset: pageToOffset(currentPage, limit),
          limit,
        },
      ],
      () => {
        return constructorObjectService.getList(relatedTableSlug, {
          data: {
            offset: pageToOffset(currentPage, limit),
            limit: id ? limit : 0,
            ...computedFilters,
            from_detail_page: true,
          },
        });
      },
      {
        enabled: !!appId,
        select: ({ data }) => {
          const tableData = id ? objectToArray(data.response ?? {}) : [];
          const pageCount = isNaN(data.count)
            ? 1
            : Math.ceil(data.count / limit);
          setDataLength(tableData.length);

          const fieldsMap = listToMap(data.fields);

          setFieldSlug(
            Object.values(fieldsMap).find((i) => i.table_slug === tableSlug)
              ?.slug
          );

          const columns = relation.columns
            ?.map((id, index) => fieldsMap[id])
            ?.filter((el) => el);
          const quickFilters = relation.quick_filters
            ?.map(({ field_id }) => fieldsMap[field_id])
            ?.filter((el) => el);
          return {
            tableData,
            pageCount,
            columns,
            quickFilters,
            fieldsMap,
          };
        },
      }
    );

    useEffect(() => {
      if (isNaN(parseInt(relation?.default_limit))) setLimit(15);
      else setLimit(parseInt(relation?.default_limit));
    }, [relation?.default_limit]);

    useEffect(() => {
      setTimeout(() => {
        reset({
          multi: tableData?.length ? tableData.map((i) => i) : [],
        });
      }, 0);
    }, [tableData, reset, selectedTabIndex]);

    const { isLoading: deleteLoading, mutate: deleteHandler } = useMutation(
      (row) => {
        if (relation.type === "Many2Many") {
          const data = {
            id_from: id,
            id_to: [row.guid],
            table_from: tableSlug,
            table_to: relatedTableSlug,
          };

          return constructorObjectService.deleteManyToMany(data);
        } else {
          return constructorObjectService.delete(relatedTableSlug, row.guid);
        }
      },
      {
        onSuccess: (a, b) => {
          remove(tableData.findIndex((i) => i.guid === b.guid));
        },
      }
    );

    const { data: { custom_events: customEvents = [] } = {} } =
      useCustomActionsQuery({
        tableSlug: relatedTableSlug,
      });

    const navigateToEditPage = (row) => {
      navigateToForm(relatedTableSlug, "EDIT", row);
    };

    const navigateToTablePage = () => {
      navigate(`/main/${appId}/object/${relatedTableSlug}`, {
        state: {
          [`${tableSlug}_${relation.type === "Many2Many" ? "ids" : "id"}`]: id,
        },
      });
    };

    // const { mutateAsync } = useMutation(
    //   (values) => {
    //     if (values.guid)
    //       return constructorObjectService.update(relatedTableSlug, {
    //         data: values,
    //       })
    //     else constructorObjectService.create(relatedTableSlug, { data: values })
    //   },
    //   {
    //     onSuccess: () => {
    //       setCreateFormVisible(false)
    //       queryClient.refetchQueries(["GET_OBJECT_LIST", relatedTableSlug])
    //     },
    //   }
    // )

    useImperativeHandle(
      ref,
      () => ({
        excelSort: () => {
          if (!filters) return null;
          return {
            filters,
            currentPage,
            limit,
            pageCount,
            fieldsMap,
          };
        },
      }),
      [pageCount, filters, currentPage, limit]
    );

    return (
      <div className={styles.relationTable} ref={tableRef}>
        {!!quickFilters?.length && (
          <div className={styles.filtersBlock}>
            {quickFilters.map((field) => (
              <FRow key={field.id}>
                {/* label={field.label} */}
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
        )}

        <div className={styles.tableBlock}>
          {viewPermission ? (
            <ObjectDataTable
              defaultLimit={relation?.default_limit}
              relationAction={relation}
              remove={remove}
              watch={watch}
              isRelationTable={true}
              setFormVisible={setFormVisible}
              formVisible={formVisible}
              loader={dataFetchingLoading || deleteLoading}
              data={tableData}
              isResizeble={true}
              fields={fields}
              columns={columns}
              setFormValue={setFormValue}
              control={control}
              removableHeight={290}
              disableFilters
              pagesCount={pageCount}
              currentPage={currentPage}
              onRowClick={navigateToEditPage}
              onDeleteClick={deleteHandler}
              onPaginationChange={setCurrentPage}
              filters={filters}
              filterChangeHandler={filterChangeHandler}
              paginationExtraButton={
                id && (
                  <SecondaryButton onClick={navigateToTablePage}>
                    Всe
                  </SecondaryButton>
                )
              }
              createFormVisible={createFormVisible[relation.id]}
              setCreateFormVisible={(val) =>
                setCreateFormVisible(relation.id, val)
              }
              limit={limit}
              setLimit={setLimit}
              summaries={relation.summaries}
              isChecked={(row) => selectedObjects?.includes(row.guid)}
              onCheckboxChange={!!customEvents?.length && onCheckboxChange}
              onChecked={onChecked}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
);

export default RelationTable;
