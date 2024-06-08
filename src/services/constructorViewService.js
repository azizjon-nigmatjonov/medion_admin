

import request from "../utils/request";

const constructorViewService = {
  getList: (params) => request.get('/view', { params }),
  update: (data) => request.put('/view', data),
  create: (data) => request.post('/view', data),
  getById: (id) => request.get(`/view/${id}`),
  delete: (id) => request.delete(`/view/${id}`)
}

export default constructorViewService