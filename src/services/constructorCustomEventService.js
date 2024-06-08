
import request from "../utils/request";

const constructorCustomEventService = {
  getList: (params) => request.get('/custom-event', { params }),
  update: (data) => request.put('/custom-event', data),
  create: (data) => request.post('/custom-event', data),
  delete: (id, data) => request.delete(`/custom-event/${id}`, data),
}

export default constructorCustomEventService;