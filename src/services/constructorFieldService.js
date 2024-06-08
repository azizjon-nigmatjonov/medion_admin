import request from "../utils/request"

const constructorFieldService = {
  getList: (params) => request.get("/field", { params }),
  getFieldPermission: ({ role_id, table_slug }) =>
    request.get(`field-permission/${role_id}/${table_slug}`),
  update: (data) => request.put("/field", data),
  create: (data) => request.post("/field", data),
  delete: (id) => request.delete(`/field/${id}`),
}

export default constructorFieldService
