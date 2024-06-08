import "../FormElements-backup/style.scss";

const FRow = ({
  label = "",
  children,
  position = "vertical",
  componentClassName = "",
  required = false,
  ...props
}) => {
  return (
    <div className={`FRow ${position}`} {...props}>
      <div className="label">
        {" "}
        {required && <span className="requiredStart">*</span>}{" "}
        {label && label + ":"}
      </div>
      <div className={`component ${componentClassName}`}>{children}</div>
    </div>
  );
};

export default FRow;
