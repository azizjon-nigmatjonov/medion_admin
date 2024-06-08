import request from "../utils/request";

const actionPermissionService = {
  getList: ({table_slug, role_id}) => request.get(`/action-permission/${role_id}/${table_slug}`),
}

export default actionPermissionService


