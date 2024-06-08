

import request from "../utils/request";

const applicationService = {
  getList: (params) => request.get('/app', { params }),
  update: (data) => request.put('/app', data),
  create: (data) => request.post('/app', data),
  getById: (id) => request.get(`/app/${id}`),
  delete: (id) => request.delete(`/app/${id}`)
}

export default applicationService;