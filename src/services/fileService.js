import request from "../utils/request";


const fileService = {
  upload: (data) => request.post('/upload', data),
}

export default fileService