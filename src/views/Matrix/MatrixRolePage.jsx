import { useState, useMemo, useEffect, useCallback } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
// ICONS
import { Delete } from "@mui/icons-material";
import { useMutation } from "react-query";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useDispatch } from "react-redux";
import {
  ChevronDownIcon,
  CrossPerson,
  FieldPermissionIcon,
  TwoUserIcon,
} from "../../assets/icons/icon";
// COMPONENTS
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableHeadCell,
  CTableRow,
} from "../../components/CTable";
import FormCard from "../../components/FormCard";
import FRow from "../../components/FormElements/FRow";
import HFSelect from "../../components/FormElements/HFSelect";
import HFTextField from "../../components/FormElements/HFTextField";
import HeaderSettings from "../../components/HeaderSettings";
// SERVICES
import applicationService from "../../services/applicationSercixe";
import constructorObjectService from "../../services/constructorObjectService";
import constructorRelationService from "../../services/constructorRelationService";
import roleServiceV2 from "../../services/roleServiceV2";
import styles from "./styles.module.scss";
import roleService from "../../services/roleService";
import clientRelationService from "../../services/auth/clientRelationService";
import RectangleIconButton from "../../components/Buttons/RectangleIconButton";
import SecondaryButton from "../../components/Buttons/SecondaryButton";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import { showAlert } from "../../store/alert/alert.thunk";
import FieldPermissionModal from "./FieldPermissionModal";
import ActionPermissionModal from "./ActionPermissionModal";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";

const staticTables = [
  {
    label: "APP",
    slug: "app",
    children: "true",
  },
  {
    label: "Settings",
    slug: "settings",
    children: "true",
  },
];

const MatrixRolePage = () => {
  const { roleId, typeId } = useParams();
  const TYPES = [
    { key: "read", name: "Чтение" },
    { key: "write", name: "Добавление" },
    { key: "update", name: "Изменение" },
    { key: "delete", name: "Удаление" },
  ];
  const dispatch = useDispatch();
  const [appId, setAppId] = useState(null);
  const [parentPopupKey, setParentPopupKey] = useState("");
  const [expandedAppId, setExpandedAppId] = useState("");
  const [tableSlugWithType, setTableSlugWithType] = useState(null);
  const [tableSlug, setTableSlug] = useState(null);
  const [apps, setApps] = useState([{ name: "Settings", id: "settings" }]);
  const [roles, setRoles] = useState([{ name: "Settings", id: "settings" }]);
  const [activeTable, setActiveTable] = useState({});
  const [recordPermissions, setRecordPermissions] = useState([]);
  const [connections, setConnections] = useState([]);
  const [isCustomVisible, setIsCustomVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isActionOpen, setIsActionOpen] = useState(false);
  const [relations, setRelations] = useState([]);
  const [automaticFilters, setAutomaticFilters] = useState([]);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const actionOpen = () => setIsActionOpen(true);
  const actionClose = () => setIsActionOpen(false);

  const roleForm = useForm({});

  const autoFilterForm = useForm({
    defaultValues: {
      autoFilter: [
        {
          object_field: "",
          custom_field: "",
        },
      ],
    },
  });

  const {
    fields: autoFilterFields,
    append,
    remove,
  } = useFieldArray({
    control: autoFilterForm.control,
    name: "autoFilter",
  });

  const { mutate: createAutoField } = useMutation(
    (data) => {
      constructorObjectService.updateMultiple("automatic_filter", {
        data: {
          objects: data.autoFilter?.map((i) => ({
            role_id: roleId,
            table_slug: activeTable?.slug,
            custom_field: i.custom_field,
            object_field: i.object_field,
          })),
        },
        updated_fields: [
          "role_id",
          "table_slug",
          "custom_field",
          "object_field",
        ],
      });
    },
    {
      onSuccess: () => {
        handleRecordPermission(
          recordPermissions?.find(
            (item) => item?.table_slug === tableSlugWithType.split("#")[0]
          ),
          tableSlugWithType.split("#")[1],
          "Yes",
          tableSlugWithType.split("#")[0],
          true
        );
        dispatch(showAlert("Автофильтр успешно создан", "success"));
        setIsCustomVisible(false);
        setTableSlugWithType("");
      },
    }
  );

  const getRecordPermissions = () => {
    constructorObjectService
      .getList("record_permission", {
        data: {
          role_id: roleId,
        },
      })
      .then((res) => {
        setRecordPermissions(res?.data?.response || []);
      })
      .catch((err) => {});
  };

  const getAutomaticFilters = (tSlug) => {
    constructorObjectService
      .getList("automatic_filter", {
        data: {
          role_id: roleId,
          table_slug: tSlug,
        },
      })
      .then((res) => {
        setAutomaticFilters(res?.data?.response);
      });
  };

  const getRelationsByTableSlug = (table_slug) => {
    clientRelationService
      .getList({ table_slug })
      .then((res) => {
        setRelations(
          res?.relations
            ?.filter((i) => i.table_to.slug !== table_slug)
            ?.map((i) => ({
              label: i.table_to.label,
              value: i.table_to.slug,
            }))
        );
      })
      .catch((e) => {});
  };

  const handleRecordPermission = (
    record,
    type,
    value,
    tabSlug,
    is_have_condition
  ) => {
    autoFilterForm.setValue("tabSlug", tabSlug);
    const data = {
      role_id: roleId,
      update: record?.update ? record?.update : "No",
      delete: record?.delete ? record?.delete : "No",
      read: record?.read ? record?.read : "No",
      write: record?.write ? record?.write : "No",
      table_slug: tabSlug,
      guid: record?.guid ? record?.guid : "",
      is_have_condition,
    };
    if (record?.guid) {
      constructorObjectService
        .update("record_permission", {
          data: {
            ...data,
            [type]: value,
          },
        })
        .then((res) => {
          setTableSlugWithType((prev) => (value === "Yes" ? prev : null));
          if (value === "Yes") {
            constructorRelationService
              .getList({ table_slug: tabSlug })
              .then((res) => {
                setRelations(
                  res?.relations
                    ?.filter((rel) => rel?.table_from?.slug === tabSlug)
                    ?.map((el) => el?.table_to)
                );
              });
          }
          getRecordPermissions();
        })
        .catch((err) => {});
    } else {
      constructorObjectService
        .create("record_permission", {
          data: {
            ...data,
            [type]: value,
          },
        })
        .then((res) => {
          setTableSlugWithType(null);
          getRecordPermissions();
        })
        .catch((err) => {});
    }
  };

  const getRoleById = () => {
    roleServiceV2
      .getById(roleId)
      .then((res) => {
        roleForm.setValue("name", res?.data?.response?.name || "");
      })
      .catch((err) => {});
  };

  const getApps = () => {
    applicationService
      .getList()
      .then((res) => {
        setApps((prev) => [...prev, ...(res?.apps || [])]);
        setRoles((prev) => [...prev, ...(res?.apps || [])]);
      })
      .catch((err) => {});
  };

  const getAppChildren = (id) => {
    if (id === "settings") {
      const result = [];
      apps?.forEach((element) => {
        if (element?.id !== id) {
          result.push(element);
        } else {
          result.push(element);
          result.push(...staticTables);
        }
      });
      setApps(result);
    } else {
      applicationService
        .getById(id)
        .then((res) => {
          const result = [];
          apps?.forEach((element) => {
            if (element?.id !== id) {
              result.push(element);
            } else {
              result.push(element);
              result.push(
                ...res?.tables.map((table) => ({ ...table, children: "true" }))
              );
            }
          });
          setApps(result);
        })
        .catch((err) => {});
    }
  };

  const getConnections = () => {
    constructorObjectService
      .getList("connections", { data: { client_type_id: typeId } })
      .then((res) => {
        setConnections(res?.data?.response || []);
      })
      .catch((err) => {});
  };

  const { mutate: updateAppPermission } = useMutation(
    ({ data, appId }) => roleService.updateAppPermission({ data }, appId),
    {
      onSuccess: () => {
        getRecordPermissions();
        setParentPopupKey("");
      },
    }
  );

  const isAddBtnDisabled = useMemo(() => {
    return (
      automaticFilters?.length === relations?.length &&
      autoFilterFields.length === relations?.length
    );
  }, [relations, automaticFilters, autoFilterFields]);

  useEffect(() => {
    setIsCustomVisible(false);
    autoFilterForm.reset({
      object_field: "",
      custom_field: "",
      tabSlug: "",
    });
  }, [tableSlugWithType]);

  const computedCustomFields = useMemo(() => {
    const data = [
      {
        view_slug: "User ID",
        table_slug: "user",
      },
      ...connections,
    ];
    return data?.map((el) => ({
      label: el?.table_slug,
      value: el?.table_slug + "_id",
    }));
  }, [connections]);

  useEffect(() => {
    if (!appId) {
      setApps(roles);
    } else {
      getAppChildren(appId);
    }
  }, [appId]);

  useEffect(() => {
    getRecordPermissions();
    getRoleById();
    getApps();
    getConnections();
    autoFilterForm.reset({
      object_field: "",
      custom_field: "",
    });
  }, []);

  useEffect(() => {
    if (isCustomVisible) {
      autoFilterForm.reset({
        autoFilter: automaticFilters?.map((i) => ({
          identifier: i.guid,
          object_field: i.object_field,
          custom_field: i.custom_field,
        })),
      });
    }
  }, [isCustomVisible, automaticFilters]);

  const isAppPermissionYes = useCallback(
    (items, key) => {
      return recordPermissions
        .filter((i) => items.find((j) => j.slug === i.table_slug))
        .every((i) => i[key] === "Yes");
    },
    [recordPermissions]
  );

  return (
    <div>
      <HeaderSettings
        title="Роли"
        backButtonLink={`/settings/auth/matrix_v2`}
      />
      <div style={{ margin: "8px" }}>
        <FormCard title="Инфо" icon="address-card.svg" maxWidth="100%">
          <FRow label="Название">
            <HFTextField name="name" control={roleForm.control} fullWidth />
          </FRow>
        </FormCard>

        <div style={{ marginTop: "10px" }}>
          <CTable removableHeight={null} disablePagination>
            <CTableHead>
              <CTableRow>
                <CTableHeadCell>Объекты</CTableHeadCell>
                <CTableHeadCell style={{ padding: 0 }} colSpan={4}>
                  <div
                    style={{
                      borderBottom: "1px solid #eee",
                      padding: "8px 16px",
                    }}
                  >
                    <div>Record permissions</div>
                  </div>
                  <div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr 1fr",
                      }}
                    >
                      {TYPES?.map((type) => (
                        <div
                          key={type?.key}
                          style={{
                            border: "1px solid #eee",
                            padding: "8px 16px",
                            display: "flex",
                            flexGrow: "1",
                            justifyContent: "center",
                          }}
                        >
                          {type?.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </CTableHeadCell>
                <CTableHeadCell
                  style={{
                    borderBottom: "1px solid #e5e9eb",
                  }}
                >
                  Field permissions
                </CTableHeadCell>
                <CTableHeadCell
                  style={{
                    borderBottom: "1px solid #e5e9eb",
                  }}
                >
                  Action Permission
                </CTableHeadCell>
              </CTableRow>
            </CTableHead>
            <CTableBody loader={false} columnsCount={2} dataLength={1}>
              {apps?.map((app) => (
                <CTableRow>
                  <CTableCell
                    key={app.id}
                    onClick={() => {
                      setIsCustomVisible(false);
                      if (!app.children) {
                        setApps(roles);
                        setAppId((prev) => (prev === app.id ? "" : app.id));
                        setExpandedAppId(app.id);
                      }
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        minWidth: "200px",
                      }}
                    >
                      {app?.children ? (
                        <span className={styles.app_child_title}>
                          {app?.name || app?.label}
                        </span>
                      ) : (
                        <span>{app?.name || app?.label}</span>
                      )}
                      {!app?.children && <ChevronDownIcon />}
                    </div>
                  </CTableCell>
                  {TYPES?.map((type) => (
                    <CTableCell
                      key={type?.key}
                      align="center"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (app?.children) {
                          setTableSlugWithType((prev) =>
                            prev === app.slug + "#" + type?.key
                              ? ""
                              : app.slug + "#" + type?.key
                          );
                          setParentPopupKey("");
                        } else {
                          setParentPopupKey((prev) =>
                            prev === app.id + type?.key
                              ? ""
                              : app.id + type?.key
                          );
                          setTableSlugWithType("");
                        }
                      }}
                      style={{ position: "relative" }}
                    >
                      {!app?.children ? (
                        expandedAppId === app.id && (
                          <span>
                            {isAppPermissionYes(apps, type.key) ? (
                              <TwoUserIcon />
                            ) : (
                              <CrossPerson />
                            )}
                          </span>
                        )
                      ) : recordPermissions?.find(
                          (item) => item?.table_slug === app?.slug
                        )?.is_have_condition && type?.key === "read" ? (
                        <LockOutlinedIcon />
                      ) : recordPermissions?.find(
                          (item) => item?.table_slug === app?.slug
                        )?.[type?.key] === "Yes" ? (
                        <TwoUserIcon />
                      ) : (
                        <CrossPerson />
                      )}
                      {parentPopupKey === app.id + type?.key &&
                        expandedAppId === app.id && (
                          <div className={styles.app_permission_popup}>
                            <span
                              onClick={(e) => {
                                e.preventDefault();
                                updateAppPermission({
                                  data: {
                                    role_id: roleId,
                                    [type?.key]: "Yes",
                                  },
                                  appId: app.id,
                                });
                                setParentPopupKey("");
                              }}
                            >
                              <TwoUserIcon />
                            </span>
                            <span
                              onClick={(e) => {
                                e.preventDefault();
                                updateAppPermission(
                                  {
                                    data: {
                                      role_id: roleId,
                                      [type?.key]: "No",
                                    },
                                    appId: app.id,
                                  },
                                  app.id
                                );
                                setParentPopupKey("");
                              }}
                            >
                              <CrossPerson />
                            </span>
                          </div>
                        )}
                      {tableSlugWithType === app?.slug + "#" + type?.key ? (
                        <>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              backgroundColor: "white",
                              border: "1px solid #eee",
                              padding: "12px 16px",
                              borderRadius: "6px",
                              position: "absolute",
                              top: "40px",
                              left: "30px",
                              zIndex: "2",
                              boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 2px 0px",
                            }}
                          >
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRecordPermission(
                                  recordPermissions?.find(
                                    (item) => item?.table_slug === app?.slug
                                  ),
                                  type?.key,
                                  "Yes",
                                  app?.slug,
                                  false
                                );
                              }}
                            >
                              <TwoUserIcon />
                            </span>
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRecordPermission(
                                  recordPermissions?.find(
                                    (item) => item?.table_slug === app?.slug
                                  ),
                                  type?.key,
                                  "No",
                                  app?.slug,
                                  false
                                );
                              }}
                            >
                              <CrossPerson />
                            </span>
                            {type?.key === "read" && (
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsCustomVisible((p) => !p);
                                  getAutomaticFilters(app?.slug);
                                  getRelationsByTableSlug(app?.slug);
                                  setActiveTable(app);
                                }}
                                style={{
                                  border: "1px solid #e3e3e3",
                                  padding: 6,
                                  borderRadius: "50%",
                                }}
                              >
                                <LockOutlinedIcon />
                              </span>
                            )}
                          </div>
                          <form
                            onSubmit={autoFilterForm.handleSubmit(
                              createAutoField
                            )}
                          >
                            {isCustomVisible && (
                              <div
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  backgroundColor: "white",
                                  border: "1px solid #eee",
                                  padding: "12px 16px",
                                  borderRadius: "6px",
                                  position: "absolute",
                                  top: "110px",
                                  left: "60px",
                                  zIndex: "2",
                                  minWidth: "450px",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "8px",
                                    borderBottom: "1px solid #ccc",
                                    paddingBottom: "10px",
                                    marginBottom: "10px",
                                  }}
                                >
                                  <div style={{ display: "flex" }}>
                                    <FRow
                                      style={{ marginBottom: 0 }}
                                      label="Поля объекта"
                                    />
                                    <FRow
                                      style={{ marginBottom: 0 }}
                                      label="Пользовательские поля"
                                    />
                                  </div>
                                  {autoFilterFields.map((field, index) => (
                                    <div
                                      key={field.id}
                                      style={{ display: "flex", gap: 8 }}
                                    >
                                      <HFSelect
                                        required
                                        width="50%"
                                        options={relations}
                                        control={autoFilterForm.control}
                                        name={`autoFilter.${index}.object_field`}
                                      />
                                      <HFSelect
                                        required
                                        width="50%"
                                        options={computedCustomFields}
                                        control={autoFilterForm.control}
                                        name={`autoFilter.${index}.custom_field`}
                                      />
                                      <RectangleIconButton
                                        color="error"
                                        onClick={() => {
                                          constructorObjectService.delete(
                                            "automatic_filter",
                                            field.identifier
                                          );
                                          remove(index);
                                        }}
                                      >
                                        <Delete color="error" />
                                      </RectangleIconButton>
                                    </div>
                                  ))}
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "8px",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <SecondaryButton
                                    type="button"
                                    style={{ width: "50%" }}
                                    disabled={isAddBtnDisabled}
                                    onClick={() =>
                                      isAddBtnDisabled
                                        ? null
                                        : append({
                                            object_field: "",
                                            custom_field: "",
                                          })
                                    }
                                  >
                                    Добавить новое условия
                                  </SecondaryButton>
                                  <PrimaryButton
                                    disabled={!autoFilterFields.length}
                                    style={{ width: "50%" }}
                                    type="submit"
                                  >
                                    Сохранить
                                  </PrimaryButton>
                                </div>
                              </div>
                            )}
                          </form>
                        </>
                      ) : null}
                    </CTableCell>
                  ))}
                  <CTableHeadCell
                    onClick={() => {
                      if (app?.children) {
                        handleOpen();
                        setTableSlug(app?.slug);
                      }
                    }}
                    style={{
                      borderBottom: "1px solid #e5e9eb",
                      borderRight: "1px solid #e5e9eb",
                    }}
                  >
                    <div>
                      <FieldPermissionIcon />
                    </div>
                  </CTableHeadCell>
                  <CTableHeadCell
                    onClick={() => {
                      if (app?.children) {
                        actionOpen();
                        setTableSlug(app?.slug);
                      }
                    }}
                    style={{
                      borderBottom: "1px solid #e5e9eb",
                      borderRight: "1px solid #e5e9eb",
                    }}
                  >
                    <div>
                      <PermIdentityIcon />
                    </div>
                  </CTableHeadCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </div>
      </div>
      <FieldPermissionModal
        table_slug={tableSlug}
        handleClose={handleClose}
        isOpen={isOpen}
      />
      <ActionPermissionModal
        table_slug={tableSlug}
        handleClose={actionClose}
        isOpen={isActionOpen}
      />
    </div>
  );
};

export default MatrixRolePage;
