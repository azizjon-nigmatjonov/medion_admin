import { Route, Routes } from "react-router-dom";
import CashboxLayout from "../layouts/CashboxLayout";
import CashboxAppointments from "../views/Cashbox/Appointments";



const CashboxRoutes = ({redirectLink}) => {

return <CashboxLayout>
  {/* <Routes> */}
    <Route path="appointments" element={<CashboxAppointments />}  />
  {/* </Routes> */}
</CashboxLayout>

//   return ( <Route path="/cashbox" element={<CashboxLayout />} >

//   <Route index element={<Navigate to={'/cashbox/appointments'} />} />

   
//    <Route path="appointments" element={<CashboxAppointments />}  />
//    <Route path="appointments/:type/:id" element={<KeepAliveWrapper><AppointmentsForm /></KeepAliveWrapper>}  />

//   <Route path="*" element={<Navigate to={redirectLink} />} />

//  </Route> );
}
 
export default CashboxRoutes;