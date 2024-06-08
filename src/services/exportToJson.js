import request from "../utils/request";

const exportToJsonService = {
  postToJson: (table_ids) => request.post(`/export-to-json`, table_ids),
  uploadToJson: (file_name) => request.post('/import-from-json', file_name)
}

export default exportToJsonService;