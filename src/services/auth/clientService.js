import requestAuth from "../../utils/requestAuth"


const clientService = {
  create: (data) => requestAuth.post('/client', data),
  update: (data) => requestAuth.put('/client', data),
  delete: (data) => requestAuth.delete(`/client`, { data }),
  getMatrix: (projectId) => requestAuth.get(`/client/${projectId}`),
}

export default clientService


