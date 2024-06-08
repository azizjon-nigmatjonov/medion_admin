import requestAuthV2 from "../../utils/requestAuthV2";


const clientServiceV2 = {
  create: (data) => requestAuthV2.post('/client', data),
  update: (data) => requestAuthV2.put('/client', data),
  delete: (data) => requestAuthV2.delete(`/client`, { data }),
  getMatrix: (projectId) => requestAuthV2.get(`/client/${projectId}`),
}

export default clientServiceV2


