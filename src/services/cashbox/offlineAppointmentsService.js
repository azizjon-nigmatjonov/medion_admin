



import request from "../../utils/request";

const offlineAppointmentsService = {
  getList: (params) => request.get('/offline_appointment', { params }),
  getById: (id, params) => request.get(`/offline_appointment/${id}`, { params }),
}

export default offlineAppointmentsService