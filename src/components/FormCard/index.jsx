import { Typography } from "@mui/material"
import IconGenerator from "../IconPicker/IconGenerator"
import "./style.scss"

const FormCard = ({
  visible = true,
  icon,
  children,
  title,
  className,
  extra,
  maxWidth = 700,
  ...props
}) => {
  if (!visible) return null

  return (
    <div className={`FormCard ${className}`} style={{ maxWidth }}>
      <div className="card" {...props}>
        {title && (
          <div className="header">
            <div className="left-side" >
              <IconGenerator icon={icon} />
              <h4 className="title">
                {title}
              </h4>
            </div>

            <div className="extra">{extra}</div>
          </div>
        )}
        <div className="content">{children}</div>
      </div>
    </div>
  )
}

export default FormCard
