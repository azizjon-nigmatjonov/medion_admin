import requestAuth from "../../utils/requestAuth"
import requestAuthV2 from "../../utils/requestAuthV2"

const authService = {
  login: (data) => requestAuthV2.post(`/login`, data),
  sendResetMessageToEmail: (data) =>
  requestAuth.post(`/user/send-message`, data),
  resetPassword: (data) => requestAuth.put(`/user/reset-password`, data),
  refreshToken: (data) => requestAuthV2.put(`/refresh`, data),
  sendCode: (data) => requestAuth.post(`/send-code`, data),
  verifyCode: (sms_id, otp, data) => requestAuth.post(`/verify/${sms_id}/${otp}`, data),
  sendMessage: (data) => requestAuth.post(`/send-message`, data),
  verifyEmail: (sms_id, otp, data) => requestAuth.post(`/verify-email/${sms_id}/${otp}`, data),
}

export default authService
