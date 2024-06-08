import request from "../utils/request"
import requestAuth from "../utils/requestAuth"

const roleService = {
  getList: (params) => requestAuth.get('/role', { params }),
  getById: (id, params) => requestAuth.get(`/role/${id}`, { params }),
  create: (data) => requestAuth.post('/role', data),
  update: (data) => requestAuth.put('/role', data),
  delete: (id) => requestAuth.delete(`/role/${id}`),
  addPermissionToRole: (data) => requestAuth.post(`/role-permission/many`, data),
  updateAppPermission: (data, appId) => request.post(`/permission-upsert/${appId}`, data)
}

export default roleService