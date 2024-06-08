

import request from "../utils/request";

const objectDocumentService = {
  getList: (params) => request.get('/document', { params }),
  update: (data) => request.put('/document', data),
  create: (data) => request.post('/document', data),
  delete: (id) => request.delete(`/document/${id}`),
  upload: (tableSlug, objectId, data) => request.post(`/upload-file/${tableSlug}/${objectId}`, data)
}


export default objectDocumentService;