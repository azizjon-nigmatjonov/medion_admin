

import requestAuthV2 from "../../utils/requestAuthV2"

const clientPlatformServiceV2 = {
  getList: (params) => requestAuthV2.get(`/client-platform`, { params }),
  getById: (id, params) => requestAuthV2.get(`/client-platform/${id}`, { params }),
  getDetail: (id, params) => requestAuthV2.get(`/client-platform-detailed/${id}`, { params }),
  create: (data) => requestAuthV2.post('/client-platform', data),
  update: (data) => requestAuthV2.put('/client-platform', data),
  delete: (id) => requestAuthV2.delete(`/client-platform/${id}`)
}

export default clientPlatformServiceV2


