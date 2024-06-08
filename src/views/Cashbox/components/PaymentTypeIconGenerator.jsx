import PaymeIcon from "../../../assets/icons/payme-icon.svg"
import CashIcon from "../../../assets/icons/cash-icon.svg"
import UzCardIcon from "../../../assets/icons/uzcard-icon.svg"
import HumoIcon from "../../../assets/icons/humo-icon.svg"
import ClickIcon from "../../../assets/icons/click-icon.svg"
import SVG from "react-inlinesvg"


const icons = {
  "UzCard": UzCardIcon,
  "Humo": HumoIcon,
  "Payme": PaymeIcon,
  "Наличними": CashIcon,
  "Click": ClickIcon,
}

const PaymentTypeIconGenerator = ({type}) => {
  return <SVG src={icons[type]} />
}
 
export default PaymentTypeIconGenerator;