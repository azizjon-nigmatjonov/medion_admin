import React, { useMemo } from "react";
import { useQuery } from "react-query";
import constructorObjectService from "../../services/constructorObjectService";
import get from "lodash.get";

function Many2ManyValue({ field, value }) {
  const { data: options = [] } = useQuery(
    ["GET_OBJECT_LIST", field?.table_slug],
    () => {
      return constructorObjectService.getList(field?.table_slug, {
        data: { guid: value },
      });
    },
    {
      select: (res) => res?.data?.response ?? [],
    }
  );

  const computedValue = useMemo(() => {
    const slugs = field?.view_fields?.map((item) => item?.slug) ?? [];
    return options
      ?.map((option) => slugs.map((slug) => get(option, slug, "")).join(" "))
      .join(", ");
  }, [field, options]);

  return <div>{computedValue}</div>;
}

export default Many2ManyValue;
