import request from "../utils/request";

const barcodeService = {
  getNumber: (table_slug) => request.get(`/barcode-generator/${table_slug}`,),
}

export default barcodeService;