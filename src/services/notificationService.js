import request from "../utils/request";


const notificationService = {
  getList: (params) => request.get('/notification', {params}),
  update: (data) => request.put('/notification', data),
}

export default notificationService