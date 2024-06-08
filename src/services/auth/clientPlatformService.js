

import requestAuth from "../../utils/requestAuth"

const clientPlatformService = {
  getList: (params) => requestAuth.get(`/client-platform`, { params }),
  getById: (id, params) => requestAuth.get(`/client-platform/${id}`, { params }),
  getDetail: (id, params) => requestAuth.get(`/client-platform-detailed/${id}`, { params }),
  create: (data) => requestAuth.post('/client-platform', data),
  update: (data) => requestAuth.put('/client-platform', data),
  delete: (id) => requestAuth.delete(`/client-platform/${id}`)
}

export default clientPlatformService


