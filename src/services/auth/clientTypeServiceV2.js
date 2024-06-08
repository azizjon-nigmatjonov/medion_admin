import requestAuthV2 from "../../utils/requestAuthV2";

const clientTypeServiceV2 = {
  getList: (params) => requestAuthV2.get(`/client-type`, { params }),
  getById: (id, params) => requestAuthV2.get(`/client-type/${id}`, { params }),
  create: (data) => requestAuthV2.post('/client-type', data),
  update: (data) => requestAuthV2.put('/client-type', data),
  delete: (id) => requestAuthV2.delete(`/client-type/${id}`)
}

export default clientTypeServiceV2


