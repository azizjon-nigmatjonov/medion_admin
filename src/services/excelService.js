import request from "../utils/request";


const excelService = {
  getExcel: ({excel_id}) => request.get(`/excel/${excel_id}`),
  upload: (excel_id, data) => request.post(`/excel/excel_to_db/${excel_id}`, data),
}

export default excelService