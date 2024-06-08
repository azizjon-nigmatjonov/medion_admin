import { useQuery } from "react-query";
import constructorCustomEventService from "../../services/constructorCustomEventService";


const useCustomActionsQuery = ({ tableSlug, queryPayload = {}, queryParams = {}, data }) => {
  
  const query = useQuery(['GET_CUSTOM_ACTIONS', tableSlug, queryPayload], () => {
    return constructorCustomEventService.getList({
      table_slug: tableSlug,
      ...queryPayload
    })
  }, {
    enabled: !!tableSlug,
    ...queryParams
  })

  return query
}
 
export default useCustomActionsQuery;