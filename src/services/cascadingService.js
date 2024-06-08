import request from "../utils/request"

const cascadingService = {
  getList: ({table_slug}) =>
    request.get(`get-relation-cascading/${table_slug}`),
}

export default cascadingService
