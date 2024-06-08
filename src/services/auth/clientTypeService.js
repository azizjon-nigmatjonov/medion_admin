import requestAuth from "../../utils/requestAuth"


const clientTypeService = {
  getList: (params) => requestAuth.get(`/client-type`, { params }),
  getById: (id, params) => requestAuth.get(`/client-type/${id}`, { params }),
  create: (data) => requestAuth.post('/client-type', data),
  update: (data) => requestAuth.put('/client-type', data),
  delete: (id) => requestAuth.delete(`/client-type/${id}`)
}

export default clientTypeService


