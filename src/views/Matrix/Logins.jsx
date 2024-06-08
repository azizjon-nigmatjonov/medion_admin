import { Delete, Save } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { EditIcon, FilterIcon, PlusIcon } from "../../assets/icons/icon";
import FormCard from "../../components/FormCard";
import HFSelect from "../../components/FormElements/HFSelect";
import HFTextField from "../../components/FormElements/HFTextField";
import constructorObjectService from "../../services/constructorObjectService";
import RectangleIconButton from "../../components/Buttons/RectangleIconButton";
import styles from "./styles.module.scss";

const Logins = ({ tables, fields, clientType, getFields = () => {} }) => {
  const { typeId } = useParams();
  const [isCreating, setIsCreating] = useState(false);
  const [logins, setLogins] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedClient, setSelectedClient] = useState({});
  const loginOptions = [
    {
      value: "Login with password",
      label: "Login with Password",
      translation: "Логин с паролем",
      type: "SINGLE_LINE",
    },
    {
      value: "Phone OTP",
      label: "Phone OTP",
      translation: "Логин с тел. номером",
      type: "PHONE",
    },
    {
      value: "Email OTP",
      label: "Email OTP",
      translation: "Логин с e-mail",
      type: "EMAIL",
    },
  ];

  const getLogins = () => {
    constructorObjectService
      .getList("test_login", {
        data: {
          client_type_id: typeId,
        },
      })
      .then((res) => {
        setLogins(res?.data?.response || []);
      })
      .catch((err) => {});
  };

  const deleteLogins = (table_slug, id) => {
    constructorObjectService
      .delete(table_slug, id)
      .then(() => getLogins())
      .catch((e) => {});
  };

  const handleSubmit = (type) => {
    const data = {
      client_type_id: clientType?.guid,
      login_strategy: loginForm.getValues().login_strategy,
      object_id: loginForm.getValues().login_table.object_id,
      table_slug: tables.find(
        (item) => item.id === loginForm.getValues().login_table.object_id
      )?.slug,
      login_label: loginForm.getValues().login_label,
      password_label: loginForm.getValues().password_label || "",
      login_view: loginForm.getValues().login_view || "",
      password_view: loginForm.getValues().password_view || "",
      guid: loginForm.getValues().guid,
    };
    if (type === "update") {
      constructorObjectService
        .update("test_login", {
          data: {
            ...data,
          },
        })
        .then((res) => {
          getLogins();
          loginForm.reset();
        })
        .catch((err) => {})
        .finally(() => {
          setIsEditing("");
        });
    } else {
      constructorObjectService
        .create("test_login", {
          data: {
            ...data,
          },
        })
        .then((res) => {
          setIsCreating(false);
          loginForm.reset();
          getLogins();
        })
        .catch((err) => {});
    }
  };

  const loginForm = useForm({
    defaultValues: {
      client_type_id: "",
      login_strategy: "",
      guid: "",
      login_table: {
        object_id: "",
        table_slug: "",
      },
      login_label: "",
      password_label: "",
      login_view: "",
      password_view: "",
    },
  });

  const editingClient = (client) => {
    setIsCreating(false);
    setSelectedClient(client);
    setIsEditing(client?.guid);
    loginForm.setValue("login_strategy", client?.login_strategy);
    loginForm.setValue("login_table.object_id", client?.object_id);
    loginForm.setValue("login_table.table_slug");
    loginForm.setValue("login_label", client?.login_label);
    loginForm.setValue("password_label", client?.password_label);
    loginForm.setValue("login_view", client?.login_view);
    loginForm.setValue("password_view", client?.password_view);
    loginForm.setValue("guid", client?.guid);
    getFields({ table_id: client?.object_id });
  };

  const handleCreate = () => {
    setIsEditing("");
    loginForm.reset();
    setIsCreating(true);
  };

  useEffect(() => {
    getLogins();
  }, []);

  const login_strategy = loginForm.watch("login_strategy");

  const computedListOptions = (arr, arr2) => {
    return arr.filter((item) => {
      return !arr2.some((item2) => item2.login_strategy === item.value);
    });
  };

  return (
    <FormCard title="Логин" icon="address-card.svg" maxWidth="100%">
      <div className={styles.login_card}>
        {logins.map((login) => (
          <div className={styles.card_holder} key={login?.guid}>
            <div className={styles.card_header}>
              <div className={styles.card_header_left}>
                <div className={styles.card_header_title}>
                  {isEditing !== login?.guid
                    ? loginOptions?.find(
                        (item) => item?.value === login?.login_strategy
                      )?.translation
                    : loginOptions?.find(
                        (item) => item?.value === login_strategy
                      )?.translation}
                </div>
                {isEditing !== login?.guid ? (
                  <>
                    <HFTextField
                      name=""
                      control={loginForm.control}
                      value={login?.login_strategy}
                      fullWidth
                      disabled
                    />
                    <HFTextField
                      name=""
                      control={loginForm.control}
                      value={
                        tables?.find((item) => item.value === login?.object_id)
                          ?.label
                      }
                      fullWidth
                      disabled
                    />
                  </>
                ) : (
                  <>
                    <HFSelect
                      options={loginOptions}
                      control={loginForm.control}
                      name="login_strategy"
                      onChange={(e) => {
                        loginForm.setValue("login_strategy", e);
                      }}
                      required
                      disabled
                    />
                    <HFSelect
                      options={tables}
                      control={loginForm.control}
                      onChange={(e) => {
                        getFields({ table_id: e });
                      }}
                      name="login_table.object_id"
                      required
                    />
                  </>
                )}
              </div>
              <div className={styles.action_btns}>
                {isEditing !== login?.guid ? (
                  <div
                    className={styles.card_header_right}
                    onClick={() => {
                      editingClient(login);
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
                  onClick={() => deleteLogins("test_login", login.guid)}
                >
                  <Delete color="error" />
                </RectangleIconButton>
              </div>
            </div>
            <div className={styles.card_body}>
              <div className={styles.card_body_head}>
                <div>
                  Название
                  <FilterIcon />
                </div>
                <div>
                  View field
                  <FilterIcon />
                </div>
              </div>
              <div className={styles.card_body_items}>
                <div>
                  {isEditing !== login?.guid ? (
                    <>
                      <HFTextField
                        name=""
                        control={loginForm.control}
                        value={login?.login_label}
                        fullWidth
                        disabled
                      />
                      {login.login_strategy === "Login with password" && (
                        <HFTextField
                          name=""
                          control={loginForm.control}
                          fullWidth
                          value={login?.password_label}
                          disabled
                        />
                      )}
                    </>
                  ) : (
                    <>
                      <HFTextField
                        name=""
                        value={selectedClient?.login}
                        onChange={(e) => {
                          setSelectedClient({
                            ...selectedClient,
                            login_label: e.target.value,
                          });
                          loginForm.setValue("login_label", e.target.value);
                        }}
                        control={loginForm.control}
                        fullWidth
                      />
                      {login_strategy === "Login with password" && (
                        <HFTextField
                          name=""
                          value={selectedClient?.password}
                          onChange={(e) => {
                            setSelectedClient({
                              ...selectedClient,
                              password_label: e.target.value,
                            });
                            loginForm.setValue(
                              "password_label",
                              e.target.value
                            );
                          }}
                          control={loginForm.control}
                          fullWidth
                        />
                      )}
                    </>
                  )}
                </div>
                <div>
                  {isEditing !== login?.guid ? (
                    <>
                      <HFTextField
                        name=""
                        control={loginForm.control}
                        value={login?.login_view}
                        fullWidth
                        disabled
                      />
                      {login.login_strategy === "Login with password" && (
                        <HFTextField
                          name=""
                          control={loginForm.control}
                          value={login?.password_view}
                          fullWidth
                          disabled
                        />
                      )}
                    </>
                  ) : (
                    <>
                      <HFSelect
                        options={fields.filter(
                          (item) =>
                            item.type ===
                            loginOptions?.find(
                              (loginOption) =>
                                loginOption?.value === login.login_strategy
                            ).type
                        )}
                        control={loginForm.control}
                        name="login_view"
                        onChange={(e) => {
                          loginForm.setValue("login_view", e);
                          setSelectedClient({
                            ...selectedClient,
                            login_view: e,
                          });
                        }}
                        value={selectedClient?.login_view}
                        required
                      />
                      {login_strategy === "Login with password" && (
                        <HFSelect
                          options={fields.filter(
                            (item) => item.type === "PASSWORD"
                          )}
                          control={loginForm.control}
                          name="password_view"
                          onChange={(e) => {
                            loginForm.setValue("password_view", e);
                            setSelectedClient({
                              ...selectedClient,
                              password_view: e,
                            });
                          }}
                          value={selectedClient?.password_view}
                          required
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isCreating && (
          <>
            <div className={styles.card_holder}>
              <div className={styles.card_header}>
                <div
                  className={styles.card_header_left}
                  style={{ flexGrow: 1 }}
                >
                  <div className={styles.card_header_title}>
                    {
                      loginOptions?.find(
                        (item) => item?.value === login_strategy
                      )?.translation
                    }
                  </div>
                  <HFSelect
                    options={computedListOptions(loginOptions, logins) || []}
                    control={loginForm.control}
                    name="login_strategy"
                    onChange={(e) => {
                      loginForm.setValue("login_strategy", e);
                    }}
                    required
                  />
                  <HFSelect
                    options={tables}
                    control={loginForm.control}
                    onChange={(e) => {
                      getFields({ table_id: e });
                    }}
                    name="login_table.object_id"
                    required
                  />
                </div>
              </div>
              <div className={styles.card_body}>
                <div className={styles.card_body_head}>
                  <div>
                    Название
                    <FilterIcon />
                  </div>
                  <div>
                    View field
                    <FilterIcon />
                  </div>
                </div>
                <div className={styles.card_body_items}>
                  <div>
                    <HFTextField
                      name="login_label"
                      onChange={(e) => {
                        loginForm.setValue("login_label", e.target.value);
                      }}
                      control={loginForm.control}
                      fullWidth
                    />
                    {login_strategy === "Login with password" && (
                      <HFTextField
                        name="password_label"
                        onChange={(e) => {
                          loginForm.setValue("password_label", e.target.value);
                        }}
                        control={loginForm.control}
                        fullWidth
                      />
                    )}
                  </div>
                  <div>
                    <HFSelect
                      options={fields.filter(
                        (item) =>
                          item?.type ===
                          loginOptions?.find(
                            (el) => el?.value === login_strategy
                          )?.type
                      )}
                      control={loginForm.control}
                      name="login_view"
                      // value={loginForm.getValues().login_view}
                      onChange={(e) => {
                        loginForm.setValue("login_view", e);
                      }}
                      required
                    />
                    {login_strategy === "Login with password" && (
                      <HFSelect
                        options={fields.filter(
                          (item) => item.type === "PASSWORD"
                        )}
                        control={loginForm.control}
                        // value={loginForm.getValues().password_view}
                        name="password_view"
                        onChange={(e) => {
                          loginForm.setValue("password_view", e);
                        }}
                        required
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.actions}>
                <button
                  className={styles.cancel_btn}
                  onClick={() => {
                    setIsCreating(false);
                    loginForm.reset();
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
                  {isEditing ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </>
        )}

        <div>
          <button className={styles.add_login_btn} onClick={handleCreate}>
            <PlusIcon />
            Добавить
          </button>
        </div>
      </div>
    </FormCard>
  );
};

export default Logins;
