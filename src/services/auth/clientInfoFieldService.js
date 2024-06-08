import requestAuth from "../../utils/requestAuth"

const clientInfoFieldService = {
  getList: (params) => requestAuth.get('/role', { params }),
  create: (data) => requestAuth.post('/user-info-field', data),
  update: (data) => requestAuth.put('/user-info-field', data),
  delete: (id) => requestAuth.delete(`/user-info-field/${id}`),
}

export default clientInfoFieldService