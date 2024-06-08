



import request from "../../utils/request";

const panelService = {
  getList: (params) => request.get('/analytics/panel', { params }),
  update: (data) => request.put('/analytics/panel', data),
  create: (data) => request.post('/analytics/panel', data),
  getById: (id) => request.get(`/analytics/panel/${id}`),
  delete: (id) => request.delete(`/analytics/panel/${id}`)
}

export default panelService;