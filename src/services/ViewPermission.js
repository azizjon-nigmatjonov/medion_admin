import request from "../utils/request";

const viewPermissionService = {
  getList: ({table_slug, role_id}) => request.get(`/view-relation-permission/${role_id}/${table_slug}`),
}

export default viewPermissionService


