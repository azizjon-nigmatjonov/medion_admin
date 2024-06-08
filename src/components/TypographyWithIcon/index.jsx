import { Typography } from "@mui/material"
import "./style.scss"

const TypographyWithIcon = ({ variant, color, children, className, ...props }) => {

  return <div className={`TypographyWithIcon ${className}`}>
    {props.icon && <props.icon className="icon" color={color} />}
    <Typography color={color} variant={variant} >{ children }</Typography>
  </div>
}

export default TypographyWithIcon
