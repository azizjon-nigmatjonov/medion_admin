import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  CTable,
  CTableHead,
  CTableHeadRow,
  CTableCell,
} from "../../../../components/CTable";
import HFSelect from "../../../../components/FormElements/HFSelect";
import GroupCascading from "../../../../components/ElementGenerators/GroupCascading";
import { Controller, useWatch } from "react-hook-form";
import { useQuery } from "react-query";
import applicationService from "../../../../services/applicationSercixe";
import constructorFieldService from "../../../../services/constructorFieldService";


const options = [
  {
    label: "Total",
    value: "total",
  },
  {
    label: "Parent",
    value: "parent",
  },
  {
    label: "Last Parent",
    value: "last_parent",
  },
  {
    label: "By field",
    value: "field",
  },
];

const ChartPercentages = ({ form, chart }) => {
  const [digitalAreas, setDigitalAreas] = useState([]);
  const { tableSlug, appId } = useParams();
  const { data: app } = useQuery(["GET_TABLE_LIST", appId], () => {
    return applicationService.getById(appId)
  })
  const selectedBalance = form.watch('relation_obj')
  const computedTablesList = useMemo(() => {
    return app?.tables?.map((table) => ({
      value: `${table.slug}#${table.id}`,
      label: table?.label
    }))
  }, [app])


  useEffect(() => {
    if(selectedBalance.split('#')[0] !== 'undefined') {
      selectedBalance && constructorFieldService.getList({
        table_slug: selectedBalance.split('#')[0]
      }).then((res) => {
        setDigitalAreas(
          res.fields
            .filter(
              (item) => item.type === "NUMBER"
            )
            .map((item) => ({
              label: item.label,
              value: `${item.slug}#${item.id}`,
            }))
        );
      })
    }
  }, [selectedBalance])


  return (
    <>
      <CTable
        count={""}
        page={""}
        setCurrentPage={""}
        columnsCount={4}
        loader={false}
        removableHeight={false}
        disablePagination={true}
      >
        <CTableHead>
          <CTableHeadRow>
            <CTableCell>Percent</CTableCell>
            <CTableCell>
              <div>
                <HFSelect
                  fullWidth
                  required
                  control={form.control}
                  options={options}
                  name="typee"
                />
              </div>
            </CTableCell>
            {form.watch("typee") === "field" && (
              <CTableCell>
                <Controller
                  control={form.control}
                  name="filed_idss"
                  render={({ field: { onChange, value } }) => {
                    return (
                      <GroupCascading
                        tableSlug={tableSlug}
                        setValue={onChange}
                        value={value ?? ""}
                      />
                    )
                  }}
                />
              </CTableCell>
            )}
          </CTableHeadRow>
          <CTableHeadRow>
            <CTableCell>Balance</CTableCell>
            <CTableCell>
              <div>
                <HFSelect
                  fullWidth
                  required
                  control={form.control}
                  options={computedTablesList}
                  name="relation_obj"
                />
              </div>
            </CTableCell>
            <CTableCell>
              <div>
                <HFSelect
                  fullWidth
                  required={digitalAreas.length > 0 ? true : false}
                  control={form.control}
                  options={digitalAreas}
                  name="number_field"
                />
              </div>
            </CTableCell>
          </CTableHeadRow>
        </CTableHead>
      </CTable>
    </>
  )
};

export default ChartPercentages;
