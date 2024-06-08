import axios from "axios";
import { useEffect, useState } from "react";
import HFSelect from "../../../components/FormElements/HFSelect";
import classes from "../style.module.scss";

const DynamicFields = ({
  control,
  setValue,
  connection,
  table = {},
  index,
  userId
}) => {
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [options, setOptions] = useState([]);
  // useEffect(() => {
  //   setValue(
  //     "tables[0].object_id",
  //     table.find((item) => item.table_slug === selectedCollection)?.guid
  //   )
  //   setValue("tables[0].table_slug", selectedCollection)
  // }, [selectedCollection])

  const getConnection = () => {
    let data = {}
    if (connection?.type === "Many2Many") data[connection.field_slug] = [userId]
    axios
      .post(
        `${import.meta.env.VITE_CLIENT_BASE_URL}object/get-list/${connection?.table_slug}`,
        { data }
      )
      .then((res) => {
        // setConnections(res?.data?.data?.data?.response || []);
        setOptions(
          res?.data?.data?.data?.response?.map((option) => ({
            value: option?.guid,
            label: option[connection?.view_slug],
          }))
        );
      })
  };

  useEffect(() => {
    getConnection();
  }, []);

  // const computedOptions = useMemo(() => {
  //   return table?.map((field) => ({
  //     value: field.table_slug,
  //     label: field.name,
  //   }));
  // }, [table]);

  return (
    <div className={classes.formRow}>
      <p className={classes.label}>{table.label}</p>
      <HFSelect
        control={control}
        name={`tables[${index}].object_id`}
        size="large"
        value={selectedCollection}
        fullWidth
        options={options}
        placeholder={connection?.view_slug}
        required
        onChange={(e, val) => {
          setSelectedCollection(e);
          setValue(`tables[${index}].table_slug`, connection?.table_slug)
          // setValue(`tables[${index}]`)
        }}
        // placeholder={table.label}
      />
    </div>
  );
};

export default DynamicFields;
