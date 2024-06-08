



import request from "../../utils/request";

const onlineAppointmentsService = {
  getList: (params) => request.get('/booked_appointment', { params }),
  getById: (id, params) => request.get(`/booked_appointment/${id}`, { params }),
  update: (id, data) => request.put(`/payment_status/${id}`, data)
}

export default onlineAppointmentsService