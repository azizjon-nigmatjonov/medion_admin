import { Delete, PictureAsPdf, Print } from "@mui/icons-material";
import { Button, Card, CircularProgress, Collapse } from "@mui/material";
import { forwardRef, useMemo, useState } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Footer from "../../../components/Footer";
import HFAutoWidthInput from "../../../components/FormElements/HFAutoWidthInput";
import usePaperSize from "../../../hooks/usePaperSize";
import constructorObjectService from "../../../services/constructorObjectService";
import documentTemplateService from "../../../services/documentTemplateService";
import DropdownButton from "../components/DropdownButton";
import DropdownButtonItem from "../components/DropdownButton/DropdownButtonItem";
import Redactor from "./Redactor";
import styles from "./style.module.scss";
import { useQueries, useQuery, useQueryClient } from "react-query";
import Dialog from "@mui/material/Dialog";
import SecondaryButton from "../../../components/Buttons/SecondaryButton";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import FolderIcon from "@mui/icons-material/Folder";
import { format } from "date-fns";
import RingLoaderWithWrapper from "../../../components/Loaders/RingLoader/RingLoaderWithWrapper";

const RedactorBlock = forwardRef(
  (
    {
      templateFields,
      selectedObject,
      selectedTemplate,
      setSelectedTemplate,
      updateTemplate,
      addNewTemplate,
      tableViewIsActive,
      fields,
      selectedPaperSizeIndex,
      setSelectedPaperSizeIndex,
      exportToPDF,
      exportToHTML,
      htmlLoader,
      pdfLoader,
      print,
      selectedOutputTable,
      selectedLinkedObject,
      dateFilters,
      selectedOutputObject,
    },
    redactorRef
  ) => {
    const { tableSlug, appId, id } = useParams();
    const { control, handleSubmit, reset } = useForm();
    const [btnLoader, setBtnLoader] = useState(false);
    const [open, setOpen] = useState(false);
    const [collapse, setCollapse] = useState(false);
    const [staticGuid, setStaticGuid] = useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };
    const loginTableSlug = useSelector((state) => state.auth.loginTableSlug);
    const userId = useSelector((state) => state.auth.userId);
    const queryClient = useQueryClient();
    const selectTableSlug = selectedLinkedObject
      ? selectedLinkedObject?.split("#")?.[1]
      : tableSlug;
    const {
      selectedPaperSize,
      selectPaperIndexBySize,
      selectPaperIndexByName,
    } = usePaperSize(selectedPaperSizeIndex);

    const getFilteredData = useMemo(() => {
      return templateFields
        .filter((i) => i.type === "LOOKUP")
        .find((i) => i.table_slug === tableSlug);
    }, [templateFields, tableSlug]);

    useEffect(() => {
      reset({
        ...selectedTemplate,
        html: selectedTemplate.html,
      });
      setSelectedPaperSizeIndex(
        selectPaperIndexByName(selectedTemplate.size?.[0])
      );
    }, [
      selectedTemplate,
      reset,
      setSelectedPaperSizeIndex,
      selectPaperIndexByName,
    ]);

    const onSubmit = async (values) => {
      try {
        setBtnLoader(true);

        const savedData = redactorRef.current.getData();
        const data = {
          ...values,
          object_id: values?.objectId ?? "",
          html: savedData ?? "",
          size: [selectedPaperSize.name],
          title: values.title,
          table_slug: tableSlug,
          [getFilteredData?.slug]: selectedObject ?? undefined,
          output_object: selectedOutputTable?.split("#")?.[1],
          linked_object:
            selectedLinkedObject && selectedLinkedObject?.split("#")?.[1],
        };

        if (loginTableSlug && values.type === "CREATE") {
          data[`${loginTableSlug}_ids`] = [userId];
        }

        if (values.type !== "CREATE") {
          await constructorObjectService.update("template", { data });
          updateTemplate(data);
        } else {
          const res = await constructorObjectService.create("template", {
            data,
          });
          addNewTemplate(res);
        }

        setSelectedTemplate(null);
        queryClient.refetchQueries("GET_OBJECT_LIST", { selectTableSlug });
      } catch (error) {
        setBtnLoader(false);
      }
    };

    const permissions = useSelector((state) => state.auth.permissions);
    const permissionForUpdateTemplate = permissions?.["template"]?.["update"];

    // static
    const { data: laboratory } = useQuery({
      queryKey: [
        "GET_STATIC_LABARATORIES",
        selectedOutputObject?.value?.split("#")?.[0],
        dateFilters,
      ],
      queryFn: () => {
        return constructorObjectService.getList("laboratory", {
          data: {
            app_id: appId,
            patients_id: [selectedOutputObject?.value?.split("#")?.[0]],
            date: { $gte: dateFilters?.[0], $lt: dateFilters?.[1] },
          },
        });
      },
      enabled:
        !!selectedOutputObject?.value?.split("#")?.[0] &&
        !!selectedTemplate?.is_lab,
      cacheTime: 0,
    });

    const laboratory_results = useQueries(
      laboratory?.data?.response?.map((item, index) => {
        return {
          queryKey: ["GET_STATIC_LABARATORIES_RESULTS", index],
          queryFn: () => {
            return constructorObjectService.getList("laboratory_results", {
              data: {
                from_detail_page: true,
                laboratory_id: item?.guid,
              },
            });
          },
          select: (res) => {
            return res.data.response;
          },
        };
      }) || []
    );

    const { data: laboratory_resultss, isLoading: resultssLoading } = useQuery({
      queryKey: ["GET_STATIC_LABARATORIES_RESULTSS", staticGuid],
      queryFn: () => {
        return constructorObjectService.getList("laboratory_resultss", {
          data: {
            app_id: appId,
            laboratory_results_id: staticGuid,
          },
        });
      },
      enabled: !!staticGuid,
    });

    const resultsLoading = laboratory_results.some(
      (result) => result.isLoading
    );

    // /static

    return (
      <div
        className={`${styles.redactorBlock} ${
          tableViewIsActive ? styles.hidden : ""
        }`}
      >
        <div className={styles.pageBlock}>
          {resultsLoading ? (
            <RingLoaderWithWrapper />
          ) : (
            selectedTemplate?.is_lab && (
              <div className={styles.static}>
                {laboratory_results?.map((item) => {
                  return item?.data?.length ? (
                    <div className={styles.static__content}>
                      <h3
                        onClick={() => {
                          setCollapse(
                            collapse !==
                              item?.data?.[0]?.laboratory_id_data.date
                              ? item?.data?.[0]?.laboratory_id_data.date
                              : false
                          );
                          setStaticGuid(false);
                        }}
                      >
                        {format(
                          new Date(item?.data?.[0]?.laboratory_id_data.date),
                          "d, MMMM, yyyy"
                        )}
                        <FolderIcon style={{ color: "#6E8BB7" }} />
                      </h3>
                      <Collapse
                        in={
                          collapse === item?.data?.[0]?.laboratory_id_data.date
                        }
                        collapsedSize={0}
                      >
                        <div className={styles.firstChild}>
                          {item.data.map((elem, index) => {
                            return (
                              <div className={styles.firstChild__content}>
                                <h4
                                  onClick={() =>
                                    setStaticGuid(
                                      staticGuid !== elem.guid
                                        ? elem.guid
                                        : false
                                    )
                                  }
                                >
                                  <span>{index + 1}. </span>
                                  {elem.services_id_data.name +
                                    " " +
                                    elem.services_id_data.summ_lab}
                                  <p>
                                    {!laboratory_resultss?.data?.response
                                      ?.length &&
                                      staticGuid === elem.guid &&
                                      !resultssLoading &&
                                      "(результат не найден!)"}
                                  </p>
                                </h4>
                                {resultssLoading && staticGuid === elem.guid ? (
                                  <RingLoaderWithWrapper />
                                ) : (
                                  <Collapse
                                    in={staticGuid === elem.guid}
                                    collapsedSize={0}
                                  >
                                    {laboratory_resultss?.data?.response?.map(
                                      (item) => {
                                        return (
                                          <div className={styles.secondChild}>
                                            <li>
                                              {`${item.metric} ${item.result} ${item.measurement_type} ${item.ref_interval}`}
                                            </li>
                                          </div>
                                        );
                                      }
                                    )}
                                  </Collapse>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </Collapse>
                    </div>
                  ) : null;
                })}
              </div>
            )
          )}

          <div className={styles.templateName}>
            <HFAutoWidthInput
              control={control}
              name="title"
              inputStyle={{ fontSize: 20 }}
            />
          </div>

          <div className={styles.pageSize}>
            {selectedPaperSize.name} ({selectedPaperSize.width} x{" "}
            {selectedPaperSize.height})
          </div>

          <Redactor
            ref={redactorRef}
            control={control}
            fields={fields}
            selectedPaperSizeIndex={selectedPaperSizeIndex}
          />
        </div>

        <Footer
          extra={
            <>
              <Button
                disabled={
                  !(permissionForUpdateTemplate && selectedTemplate?.guid)
                }
                onClick={() => handleClickOpen()}
                className={styles.saveButton}
              >
                {btnLoader && <CircularProgress color="secondary" size={15} />}
                Save
              </Button>
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <Card className={styles.card}>
                  <div className={styles.body}>
                    Вы действительно хотите Сохранить?
                  </div>

                  <div className={styles.footer}>
                    <SecondaryButton
                      className={styles.button}
                      onClick={handleClose}
                    >
                      Отменить
                    </SecondaryButton>
                    <PrimaryButton
                      className={styles.button}
                      color="error"
                      onClick={handleSubmit(onSubmit)}
                    >
                      Да
                    </PrimaryButton>
                  </div>
                </Card>
              </Dialog>
              {/* <DropdownButton
                onClick={exportToHTML}
                loader={pdfLoader || htmlLoader}
                text="Generate and edit"
              >
                <DropdownButtonItem onClick={exportToPDF}>
                  <PictureAsPdf />
                  Generate PDF
                </DropdownButtonItem>
                <DropdownButtonItem onClick={print}>
                  <Print />
                  Print
                </DropdownButtonItem>
              </DropdownButton> */}
            </>
          }
        />
      </div>
    );
  }
);

export default RedactorBlock;
