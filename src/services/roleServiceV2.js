import requestAuthV2 from "../utils/requestAuthV2"

const roleServiceV2 = {
  getList: (params) => requestAuthV2.get('/role', { params }),
  getById: (id, params) => requestAuthV2.get(`/role/${id}`, { params }),
  create: (data) => requestAuthV2.post('/role', data),
  update: (data) => requestAuthV2.put('/role', data),
  delete: (id) => requestAuthV2.delete(`/role/${id}`),
  addPermissionToRole: (data) => requestAuthV2.post(`/role-permission/many`, data),
}

export default roleServiceV2