

import requestAuth from "../../utils/requestAuth"

const permissionService = {
  getList: (params) => requestAuth.get(`/permission`, { params }),
  getById: (id, params) => requestAuth.get(`/permission/${id}`, { params }),
  create: (data) => requestAuth.post('/permission', data),
  update: (data) => requestAuth.put('/permission', data),
  delete: (id) => requestAuth.delete(`/permission/${id}`),
  addScopeToPermission: (data) => requestAuth.post(`/permission-scope`, data),
  removeScopeFromPermission: (data) => requestAuth.delete(`/permission-scope`, data),
}

export default permissionService


