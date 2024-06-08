import request from "../utils/request";

const constructorSectionService = {
  getList: (params) => request.get('/section', { params }),
  update: (data) => request.put('/section', data),
}

export default constructorSectionService;