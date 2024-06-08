import CRangePicker from "../DatePickers/CRangePicker";
import "./style.scss";

const FiltersBlock = ({
  children,
  extra,
  hasBackground,
  control,
  isStatic,
  setDateFilters,
  dateFilters,
  ...props
}) => {
  return (
    <div
      className="FiltersBlock"
      style={{ background: hasBackground ? "#fff" : "" }}
      {...props}
    >
      <div className="side">{children}</div>
      <div>
        {isStatic && (
          <CRangePicker
            interval={"months"}
            value={dateFilters}
            onChange={setDateFilters}
          />
        )}
      </div>
      <div className="side"> {extra}</div>
    </div>
  );
};

export default FiltersBlock;
