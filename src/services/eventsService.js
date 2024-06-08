
import request from "../utils/request";

const eventService = {
  getList: (params) => request.get('/event', { params }),
  update: (data) => request.put('/event', data),
  create: (data) => request.post('/event', data),
  delete: (id) => request.delete(`/event/${id}`),
  getById: ({id}) => request.get(`/event/${id}`),
}

export default eventService;
