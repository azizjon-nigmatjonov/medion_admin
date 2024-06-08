

import request from "../../utils/request";

const variableService = {
  getList: (params) => request.get('/analytics/variable', { params }),
  update: (data) => request.put('/analytics/variable', data),
  create: (data) => request.post('/analytics/variable', data),
  getById: (id) => request.get(`/analytics/variable/${id}`),
  delete: (id) => request.delete(`/analytics/variable/${id}`)
}

export default variableService;