import request from "../utils/request";

const constructorRelationService = {
  getList: (params) => request.get(`/relation`, { params }),
  update: (data) => request.put(`/relation`, data),
  create: (data) => request.post(`/relation`, data),
  delete: (id) => request.delete(`/relation/${id}`),
}

export default constructorRelationService