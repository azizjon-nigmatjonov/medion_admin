import { Delete, Save } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { EditIcon, PlusIcon } from "../../assets/icons/icon";
import RectangleIconButton from "../../components/Buttons/RectangleIconButton";
import FormCard from "../../components/FormCard";
import HFIconPicker from "../../components/FormElements/HFIconPicker";
import HFSelect from "../../components/FormElements/HFSelect";
import HFTextField from "../../components/FormElements/HFTextField";
import constructorObjectService from "../../services/constructorObjectService";
import styles from "./styles.module.scss";

const Connections = ({
  clientType,
  tableIdGet,
  tables,
  fields,
  relations = [],
  getFields = () => {},
  getRelations = () => {},
}) => {
  const { typeId } = useParams();
  const [connections, setConnections] = useState([]);
  const [isEdit, setIsEdit] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const connectionForm = useForm({
    defaultValues: {
      icon: "",
      name: "",
      table_slug: "",
      main_table_slug: "",
      view_slug: "",
      view_label: "",
      client_type_id: clientType.guid,
      guid: "",
    },
  });
  const [selectedConnection, setSelectedConnection] = useState({});

  const getConnections = () => {
    constructorObjectService
      .getList("connections", { data: { client_type_id: typeId } })
      .then((res) => {
        setConnections(res?.data?.response || []);
      });
  };

  const editingConnections = (connection) => {
    setIsEdit(connection?.guid);
    setSelectedConnection(connection);
    connectionForm.setValue("icon", connection?.icon);
    connectionForm.setValue("name", connection?.name);
    connectionForm.setValue(
      "table_slug",
      tables?.find((item) => item?.slug === connection?.table_slug).id
    );
    connectionForm.setValue("view_label", connection?.view_label);
    connectionForm.setValue("view_slug", connection.view_slug);
    connectionForm.setValue("guid", connection?.guid);
    getFields({
      table_id: tables?.find((item) => item?.slug === connection?.table_slug)
        .id,
    });
  };

  const handleSubmit = (type) => {
    const relation = relations?.find(
      (i) => i.id === connectionForm.getValues().table_slug
    );
    const data = {
      icon: connectionForm.getValues().icon,
      name: connectionForm.getValues().name,
      table_slug: relation?.slug,
      view_slug: connectionForm.getValues().view_slug,
      view_label: connectionForm.getValues().view_label,
      client_type_id: clientType.guid,
      guid: connectionForm.getValues().guid,
      main_table_slug: tableIdGet,
      field_slug: relation?.field_slug,
      type: relation?.type,
    };
    if (type === "update") {
      constructorObjectService
        .update("connections", {
          data: {
            ...data,
          },
        })
        .then((res) => {
          getConnections();
          setIsEdit("");
          connectionForm.reset();
        });
    } else {
      constructorObjectService
        .create("connections", {
          data: {
            ...data,
          },
        })
        .then((res) => {
          setIsCreating(false);
          getConnections();
        });
    }
  };

  const deleteLogins = (table_slug, id) => {
    constructorObjectService
      .delete(table_slug, id)
      .then(() => getConnections())
      .catch((e) => {});
  };

  useEffect(() => {
    getConnections();
  }, []);

  return (
    <FormCard ard title="Связи" maxWidth="100%">
      <div className={styles.login_card}>
        <div>
          {connections.map((item) => (
            <div className={styles.card_holder} key={item?.guid}>
              <div className={styles.card_header}>
                <div className={styles.card_header_left}>
                  {isEdit !== item?.guid ? (
                    <>
                      <HFIconPicker
                        name=""
                        control={connectionForm.control}
                        shape="rectangle"
                        value={item?.icon}
                        disabled={isEdit !== item?.guid}
                      />
                      <HFTextField
                        name=""
                        value={item?.name}
                        disabled={isEdit !== item?.guid}
                        control={connectionForm.control}
                        fullWidth
                      />
                    </>
                  ) : (
                    <>
                      <HFIconPicker
                        name=""
                        value={selectedConnection?.icon}
                        control={connectionForm.control}
                        shape="rectangle"
                        onChange={(e) => {
                          connectionForm.setValue("icon", e);
                          setSelectedConnection({
                            ...selectedConnection,
                            icon: e,
                          });
                        }}
                      />
                      <HFTextField
                        name=""
                        value={selectedConnection?.name}
                        onChange={(e) => {
                          connectionForm.setValue("name", e.target.value);
                          setSelectedConnection({
                            ...selectedConnection,
                            name: e.target.value,
                          });
                        }}
                        control={connectionForm.control}
                        fullWidth
                      />
                    </>
                  )}
                </div>
                <div className={styles.action_btns}>
                  {isEdit !== item?.guid ? (
                    <div
                      className={styles.card_header_right}
                      onClick={() => {
                        editingConnections(item);
                      }}
                    >
                      <EditIcon />
                    </div>
                  ) : (
                    <div
                      className={styles.card_header_right}
                      onClick={() => {
                        handleSubmit("update");
                      }}
                    >
                      <Save />
                    </div>
                  )}
                  <RectangleIconButton
                    color="error"
                    onClick={() => deleteLogins("connections", item.guid)}
                  >
                    <Delete color="error" />
                  </RectangleIconButton>
                </div>
              </div>
              <div className={styles.card_body}>
                <div className={styles.card_body_items}>
                  {isEdit !== item?.guid ? (
                    <>
                      <div>
                        <HFTextField
                          name=""
                          value={
                            tables?.find(
                              (table) => table.slug === item?.table_slug
                            )?.label
                          }
                          disabled={isEdit !== item?.guid}
                          control={connectionForm.control}
                          fullWidth
                        />
                      </div>
                      <div>
                        <HFTextField
                          name=""
                          value={item?.view_slug}
                          control={connectionForm.control}
                          fullWidth
                          disabled
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <HFSelect
                          options={tables}
                          control={connectionForm.control}
                          onChange={(e) => {
                            getFields({ table_id: e });
                            connectionForm.setValue("table_slug", e);
                          }}
                          name="table_slug"
                          required
                        />
                      </div>
                      <div>
                        <HFSelect
                          options={fields}
                          control={connectionForm.control}
                          name="view_slug"
                          onChange={(e) => {
                            connectionForm.setValue("view_slug", e);
                          }}
                          required
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {isCreating && (
          <div className={styles.card_holder}>
            <div className={styles.card_header}>
              <div className={styles.card_header_left}>
                <HFIconPicker
                  name="icon"
                  control={connectionForm.control}
                  shape="rectangle"
                  onChange={(e) => {
                    connectionForm.setValue("icon", e);
                  }}
                />
                <HFTextField
                  name="name"
                  onChange={(e) => {
                    connectionForm.setValue("name", e.target.value);
                  }}
                  control={connectionForm.control}
                  fullWidth
                />
              </div>
            </div>
            <div className={styles.card_body}>
              <div className={styles.card_body_items}>
                <div className={styles.card_body_item}>
                  <div className={styles.card_body_item_inner}>
                    <HFSelect
                      options={tables}
                      control={connectionForm.control}
                      onChange={(value) => {
                        getRelations({ table_id: value });
                        connectionForm.setValue("main_table_slug", value);
                      }}
                      name="main_table_slug"
                      required
                    />
                  </div>
                  <div className={styles.card_body_item_inner}>
                    <HFSelect
                      options={relations}
                      control={connectionForm.control}
                      onChange={(e) => {
                        getFields({ table_id: e });
                        connectionForm.setValue("table_slug", e);
                      }}
                      name="table_slug"
                      required
                    />
                  </div>
                </div>
                <div className={styles.card_body_item}>
                  <HFSelect
                    options={fields}
                    control={connectionForm.control}
                    name="view_slug"
                    onChange={(e) => {
                      connectionForm.setValue("view_slug", e);
                    }}
                    required
                  />
                </div>
              </div>
            </div>
            <div className={styles.actions}>
              <button
                className={styles.cancel_btn}
                onClick={() => {
                  setIsCreating(false);
                  connectionForm.reset();
                }}
              >
                Cancel
              </button>
              <button
                className={styles.craete_btn}
                onClick={() => {
                  handleSubmit();
                }}
              >
                {isEdit ? "Update" : "Create"}
              </button>
            </div>
          </div>
        )}
        <div>
          <button
            className={styles.add_login_btn}
            onClick={() => setIsCreating(true)}
          >
            <PlusIcon />
            Добавить
          </button>
        </div>
      </div>
    </FormCard>
  );
};

export default Connections;
