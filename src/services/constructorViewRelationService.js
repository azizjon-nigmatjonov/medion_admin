import request from "../utils/request";

const constructorViewRelationService = {
  getList: (params) => request.get('/view_relation', { params }),
  update: (data) => request.put('/view_relation', data),
}

export default constructorViewRelationService;