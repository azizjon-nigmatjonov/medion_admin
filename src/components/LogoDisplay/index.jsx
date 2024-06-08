import "./style.scss"

const LogoDisplay = ({ url, name }) => {

  if (!url)
    return (
      <div className="LogoDisplay">
        <div className="logo-image">{ name?.[0] }</div>
      </div>
    )

  return (
    <div className="LogoDisplay">
      <img src={url} className="logo-image" alt="logo" />
    </div>
  )
}

export default LogoDisplay
