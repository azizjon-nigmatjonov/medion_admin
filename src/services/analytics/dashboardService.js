

import request from "../../utils/request";

const dashboardService = {
  getList: (params) => request.get('/analytics/dashboard', { params }),
  update: (data) => request.put('/analytics/dashboard', data),
  create: (data) => request.post('/analytics/dashboard', data),
  getById: (id) => request.get(`/analytics/dashboard/${id}`),
  delete: (id) => request.delete(`/analytics/dashboard/${id}`)
}

export default dashboardService;