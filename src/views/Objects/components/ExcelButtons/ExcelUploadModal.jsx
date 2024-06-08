import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import {
  CloseIcon,
  PointerIcon,
  UploadIcon,
} from "../../../../assets/icons/icon";
import HFSelect from "../../../../components/FormElements/HFSelect";
import excelService from "../../../../services/excelService";
import fileService from "../../../../services/fileService";
import styles from "./style.module.scss";
import { useParams } from "react-router-dom";
import RingLoader from "../../../../components/Loaders/RingLoader";
import RippleLoader from "../../../../components/Loaders/RippleLoader";
import { useQueryClient } from "react-query";
import listToOptions from "../../../../utils/listToOptions";
import HFMultipleSelect from "../../../../components/FormElements/HFMultipleSelect";

const ExcelUploadModal = ({ fieldsMap, handleClose }) => {
  const inputFIle = useRef();
  const { tableSlug } = useParams();
  const queryClient = useQueryClient();

  const [rows, setRows] = useState();
  const [fileName, setFileName] = useState("");
  const [tabIndex, setTabIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);
  const excelFieldOptions = useMemo(() => {
    return rows?.map((el) => ({ label: el, value: el }));
  }, [rows]);

  const { reset, control, watch, handleSubmit } = useForm();

  const fields = watch("fields");

  const fileUpload = (e) => {
    inputFIle.current.click();
  };

  const onUpload = async (e) => {
    const file = e.target.files[0];
    const data = new FormData();
    data.append("file", file);

    try {
      setVisible(true);
      const res = await fileService.upload(data);
      setFileName(res?.filename ?? "");
      const excelResponse = await excelService.getExcel({
        excel_id: res?.filename.replace(/\.[^.$]+$/, ""),
      });
      setRows(excelResponse?.rows ?? []);
      setVisible(false);
      setTabIndex(1);
    } catch (error) {}
  };

  const onSubmit = (values) => {
    setBtnLoader(true);
    const computedData = {};
    values?.fields?.forEach((field) => {
      if (field.excelSlug) {
        if (field.viewFieldSlug) {
          computedData[field.excelSlug] = `${field.id},${field.viewFieldSlug}`;
        } else computedData[field.excelSlug] = field.id;
      }
    });

    excelService
      .upload(fileName.replace(/\.[^.$]+$/, ""), {
        data: {
          ...computedData,
        },
        table_slug: tableSlug,
      })
      .then((res) => {
        queryClient.refetchQueries("GET_OBJECTS_LIST", { tableSlug });
      })
      .catch((err) => {})
      .finally(() => {
        handleClose();
        setBtnLoader(false);
      });
  };

  const clearBtn = () => {
    reset();
  };

  useEffect(() => {
    reset({
      fields: Object.values(fieldsMap) ?? [],
    });
  }, [fieldsMap, reset]);

  const viewFieldsToOptions = (options, field) => {
    return (
      options?.map((el) => ({
        value: el.id,
        label: `${field.label ?? ""} (${el.label})`,
      })) ?? []
    );
  };

  return (
    <div className={styles.dialog_content}>
      <div className={styles.dialog_tabs_header}>
        <Tabs className={styles.tabs_head} selectedIndex={tabIndex}>
          <TabList className={styles.tabs_list}>
            <Tab className={styles.tabs_item}>
              <span>Загрузить файл</span>
            </Tab>
            <Tab className={styles.tabs_item}>
              <span>Подтверждения</span>
            </Tab>
            <button onClick={handleClose} className={styles.tabs_close}>
              <CloseIcon style={{ color: "#6E8BB7" }} />
            </button>
          </TabList>

          <TabPanel>
            <div className={styles.dialog_upload}>
              {visible ? (
                <div className={styles.tab_loader}>
                  <RingLoader />
                </div>
              ) : (
                <div className={styles.dialog_upload_section}>
                  <UploadIcon />
                  <p>Drag and drop files here</p>
                  <input
                    type="file"
                    id="file"
                    ref={inputFIle}
                    style={{ display: "none" }}
                    onChange={onUpload}
                  />
                  <button onClick={fileUpload}>Browse</button>
                </div>
              )}
            </div>
          </TabPanel>
          <TabPanel>
            <div className={styles.tabs_select}>
              <div className={styles.upload_select}>
                <div className={styles.upload_select_item}>
                  <h2>Экспорт загаловка столбца</h2>
                  <h2 className={styles.excel_title}>
                    Excel заголовка столбца
                  </h2>
                </div>
                <div className={styles.select_body_content}>
                  {fields
                    ?.sort(
                      (first, second) =>
                        (second.required === true) - (first.required === true)
                    )
                    .map((item, index) => (
                      <div key={item} className={styles.select_body_layer}>
                        <div className={styles.select_body}>
                          <div className={styles.select_body_item}>
                            {item?.type === "LOOKUP" ||
                            item?.type === "LOOKUPS" ? (
                              <HFMultipleSelect
                                name={`fields[${index}].viewFieldSlug`}
                                placeholder={item.label}
                                control={control}
                                options={viewFieldsToOptions(
                                  item?.view_fields,
                                  item
                                )}
                                width={"250px"}
                              />
                            ) : (
                              <input
                                type="text"
                                value={`${item?.label}${
                                  item?.required ? "*" : ""
                                }`}
                                placeholder=""
                                disabled
                                className={styles.input_control}
                              />
                            )}
                            <div className={styles.select_pointer}>
                              <PointerIcon />
                            </div>
                            <div className={styles.select_options}>
                              <HFSelect
                                name={`fields[${index}].excelSlug`}
                                control={control}
                                options={excelFieldOptions}
                                width={"264px"}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                <div className={styles.control_btns}>
                  <button
                    className={styles.control_clear}
                    onClick={() => clearBtn()}
                  >
                    Сбросить
                  </button>
                  <button
                    className={styles.control_upload}
                    onClick={handleSubmit(onSubmit)}
                  >
                    {btnLoader ? (
                      <span className={styles.btn_loader}>
                        <RippleLoader size="btn_size" height="20px" />
                      </span>
                    ) : (
                      "Загрузить"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default ExcelUploadModal;
