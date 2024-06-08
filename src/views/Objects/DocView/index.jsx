import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import FiltersBlock from "../../../components/FiltersBlock";
import PageFallback from "../../../components/PageFallback";
import useDebounce from "../../../hooks/useDebounce";
import usePaperSize from "../../../hooks/usePaperSize";
import constructorObjectService from "../../../services/constructorObjectService";
import documentTemplateService from "../../../services/documentTemplateService";
import {
  pixelToMillimeter,
  pointToMillimeter,
} from "../../../utils/SizeConverters";
import DocumentSettingsTypeSelector from "../components/DocumentSettingsTypeSelector";

import ViewTabSelector from "../components/ViewTypeSelector";
import DocRelationsSection from "./DocRelationsSection";
import DocSettingsBlock from "./DocSettingsBlock";
import { contentStyles } from "./editorContentStyles";
import RedactorBlock from "./RedactorBlock";
import styles from "./style.module.scss";
import TemplatesList from "./TemplatesList";
import { showAlert } from "../../../store/alert/alert.thunk";
import { subDays } from "date-fns";

const DocView = ({ views, selectedTabIndex, setSelectedTabIndex }) => {
  const redactorRef = useRef();
  const { state } = useLocation();
  const { tableSlug, id } = useParams();

  const queryClient = useQueryClient();

  const loginTableSlug = useSelector((state) => state.auth.loginTableSlug);
  const userId = useSelector((state) => state.auth.userId);

  // =====SETTINGS BLOCK=========
  const [pdfLoader, setPdfLoader] = useState(false);
  const [exportPdfLoader, setExportPdfLoader] = useState(false);
  const [htmlLoader, setHtmlLoader] = useState(false);
  const [selectedSettingsTab, setSelectedSettingsTab] = useState(1);
  const [relationViewIsActive, setRelationViewIsActive] = useState(false);
  const [selectedPaperSizeIndex, setSelectedPaperSizeIndex] = useState(0);
  const [selectedOutputTable, setSelectedOutputTable] = useState("");
  const [selectedOutputObject, setSelectedOutputObject] = useState("");
  const [selectedLinkedObject, setSelectedLinkedObject] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedObject, setSelectedObject] = useState("");
  const [customTitle, setCustomTitle] = useState("");

  const selectedObjectServiceName = useMemo(() => {
    return selectedLinkedObject?.services_id_data?.name ?? "";
  }, [selectedObject]);

  const dispatch = useDispatch();
  const selectLinkedObject = selectedObject?.value;
  const setVar = useMemo(() => {
    if (
      state &&
      selectedObject &&
      selectedLinkedObject &&
      selectedOutputObject
    ) {
      return true;
    } else return false;
  }, [selectedLinkedObject, selectedObject, state && selectedOutputObject]);
  // ============SELECTED LINKED TABLE SLUG=============
  const selectedLinkedTableSlug = selectedLinkedObject
    ? selectedLinkedObject?.split("#")?.[1]
    : tableSlug;

  const { selectedPaperSize } = usePaperSize(selectedPaperSizeIndex);

  const [selectedTemplate, setSelectedTemplate] = useState(
    state?.template ?? null
  );

  // ========FIELDS FOR RELATIONS=========
  const { data: fields = [], isLoading: fieldsLoading } = useQuery(
    [
      "GET_OBJECTS_LIST_WITH_RELATIONS",
      { tableSlug: selectedLinkedTableSlug, limit: 0, offset: 0 },
    ],
    () => {
      return constructorObjectService.getList(selectedLinkedTableSlug, {
        data: { with_relations: true, limit: 0, offset: 0 },
      });
    },
    {
      cacheTime: 10,
      select: (res) => {
        const fields = res.data?.fields ?? [];
        const relationFields =
          res?.data?.relation_fields?.map((el) => ({
            ...el,
            label: `${el.label} (${el.table_label})`,
          })) ?? [];

        return [...fields, ...relationFields]?.filter(
          (el) => el.type !== "LOOKUP"
        );
      },
    }
  );
  // ========GET TEMPLATES LIST===========
  const {
    data: { templates, templateFields } = { templates: [], templateFields: [] },
    isLoading,
    refetch,
  } = useQuery(
    ["GET_DOCUMENT_TEMPLATE_LIST", tableSlug, searchText],
    () => {
      const data = {
        limit: 10,
        offset: 0,
        view_fields: ["title"],
        search: searchText,
        additional_request: {
          additional_field: ["guid"],
          additional_values: [state?.template?.guid],
        },
      };

      data[`${loginTableSlug}_ids`] = [userId];

      return constructorObjectService.getList("template", {
        data,
      });
    },
    {
      cacheTime: 10,
      select: ({ data }) => {
        const templates = data?.response ?? [];
        const templateFields = data?.fields ?? [];

        return {
          templates,
          templateFields,
        };
      },
      // onSuccess: () => {
      // },
    }
  );

  // ========UPDATE TEMPLATE===========

  const updateTemplate = (template) => {
    refetch();
  };

  // ==========SEARCH TEMPLATES=========
  const inputChangeHandler = useDebounce((val) => setSearchText(val), 300);

  // ========ADD NEW TEMPLATE=========
  const addNewTemplate = (template) => {
    refetch();
  };

  // =======EXPORT TO PDF============
  const exportToPDF = async () => {
    if (!selectedTemplate) return;
    setPdfLoader(true);

    try {
      let html = redactorRef.current.getData();

      const meta = `<head><meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\"></head><style>${contentStyles}</style>`;

      fields.forEach((field) => {
        html = html.replaceAll(
          `{ ${field.label} }`,
          `<%= it.${field.path_slug ?? field.slug} %>`
        );
      });

      let pageSize = pointToMillimeter(selectedPaperSize.height);

      if (selectedPaperSize.height === 1000) {
        pageSize = pixelToMillimeter(
          document.querySelector(".ck-content").offsetHeight - 37
        );
      }
      const res = await documentTemplateService.exportToPDF({
        data: {
          linked_table_slug: selectedLinkedTableSlug,
          linked_object_id: selectedObject?.value,
          page_size: selectedPaperSize.name,
          page_height: pageSize,
          page_width: pointToMillimeter(selectedPaperSize.width),
          object_id: selectedOutputObject?.value?.split("#")?.[0],
          table_slug: selectedOutputTable?.split("#")?.[1],
          title: customTitle ?? selectedTemplate?.title,
        },
        html: `${meta} <div class="ck-content" style="width: ${pointToMillimeter(
          selectedPaperSize.width + 145
        )}mm" >${html}</div>`,
      });

      queryClient.refetchQueries([
        "GET_OBJECT_FILES",
        { tableSlug, selectLinkedObject },
      ]);

      window.open(res.link, { target: "_blank" });
    } finally {
      setPdfLoader(false);
    }
  };

  // =======EXPORT BUT NOT OPEN IN TAB============
  const exportButNotOpen = async () => {
    if (!selectedTemplate) return;
    setExportPdfLoader(true);

    try {
      let html = redactorRef.current.getData();

      const meta = `<head><meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\"></head><style>${contentStyles}</style>`;

      fields.forEach((field) => {
        html = html.replaceAll(
          `{ ${field.label} }`,
          `<%= it.${field.path_slug ?? field.slug} %>`
        );
      });

      let pageSize = pointToMillimeter(selectedPaperSize.height);

      if (selectedPaperSize.height === 1000) {
        pageSize = pixelToMillimeter(
          document.querySelector(".ck-content").offsetHeight - 37
        );
      }
      const res = await documentTemplateService.exportToPDF({
        data: {
          linked_table_slug: selectedLinkedTableSlug,
          linked_object_id: selectedObject?.value,
          page_size: selectedPaperSize.name,
          page_height: pageSize,
          page_width: pointToMillimeter(selectedPaperSize.width),
          object_id: selectedOutputObject?.value?.split("#")?.[0],
          table_slug: selectedOutputTable?.split("#")?.[1],
          title: customTitle === "" ? selectedTemplate?.title : customTitle,
        },
        html: `${meta} <div class="ck-content" style="width: ${pointToMillimeter(
          selectedPaperSize.width + 145
        )}mm" >${html}</div>`,
      });

      queryClient.refetchQueries([
        "GET_OBJECT_FILES",
        { tableSlug, selectLinkedObject },
      ]);

      dispatch(showAlert("Success", "success"));
    } finally {
      setExportPdfLoader(false);
    }
  };

  // ========EXPORT TO HTML===============

  const exportToHTML = async () => {
    if (!selectedTemplate) return;
    setHtmlLoader(true);

    try {
      let html = redactorRef.current.getData();
      const meta = `<head><meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\"></head>`;

      fields.forEach((field) => {
        html = html.replaceAll(
          `{ ${field.label} }`,
          `<%= it.${field.path_slug ?? field.slug} %>`
        );
      });

      const res = await documentTemplateService.exportToHTML({
        data: {
          table_slug: tableSlug,
          linked_object_id: selectedObject?.value,
          linked_table_slug: selectedLinkedTableSlug,
        },
        html: meta + html,
      });

      setSelectedTemplate((prev) => ({
        ...prev,
        html: res.html.replaceAll("<p></p>", ""),
        size: [selectedPaperSize?.name],
      }));
    } finally {
      setHtmlLoader(false);
    }
  };

  // =======PRINT============

  const print = async () => {
    if (!selectedTemplate) return;
    setPdfLoader(true);

    try {
      let html = redactorRef.current.getData();

      const meta = `<head><meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\"></head>`;

      fields.forEach((field) => {
        html = html.replaceAll(
          `{ ${field.label} }`,
          `<%= it.${field.path_slug ?? field.slug} %>`
        );
      });

      const computedHTML = `${meta} ${html} `;

      // printJS({ printable: computedHTML, type: 'raw-html', style: [
      //   `@page { size: ${selectedPaperSize.width}pt ${selectedPaperSize.height}pt; margin: 5mm;} body { margin: 0 }`
      // ],
      // targetStyles: ["*"] })
    } finally {
      setPdfLoader(false);
    }
  };

  useEffect(() => {
    if (setVar) {
      exportToHTML();
    }
  }, [setVar]);

  const currentDate = new Date();
  const thirtyDaysAgo = subDays(currentDate, 30);
  const [dateFilters, setDateFilters] = useState([thirtyDaysAgo, currentDate]);

  return (
    <div>
      <FiltersBlock
        style={{ padding: 0 }}
        extra={
          <>
            <DocumentSettingsTypeSelector
              selectedTabIndex={selectedSettingsTab}
              setSelectedTabIndex={setSelectedSettingsTab}
            />
          </>
        }
        isStatic={!!selectedTemplate?.is_lab}
        setDateFilters={setDateFilters}
        dateFilters={dateFilters}
      >
        <ViewTabSelector
          selectedTabIndex={selectedTabIndex}
          setSelectedTabIndex={setSelectedTabIndex}
          views={views}
        />
      </FiltersBlock>

      <div className={styles.mainBlock}>
        <TemplatesList
          templates={templates}
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
          onChange={inputChangeHandler}
          setSelectedOutputTable={setSelectedOutputTable}
          setSelectedOutputObject={setSelectedOutputObject}
          setSelectedLinkedObject={setSelectedLinkedObject}
          isLoading={isLoading}
        />

        {relationViewIsActive && (
          <div className={styles.redactorBlock}>
            <DocRelationsSection />
          </div>
        )}

        {!relationViewIsActive && (
          <>
            {selectedTemplate ? (
              <>
                {fieldsLoading ? (
                  <PageFallback />
                ) : (
                  <RedactorBlock
                    templateFields={templateFields}
                    selectedObject={selectedObject}
                    selectedTemplate={selectedTemplate}
                    setSelectedTemplate={setSelectedTemplate}
                    updateTemplate={updateTemplate}
                    addNewTemplate={addNewTemplate}
                    ref={redactorRef}
                    fields={fields}
                    selectedPaperSizeIndex={selectedPaperSizeIndex}
                    setSelectedPaperSizeIndex={setSelectedPaperSizeIndex}
                    htmlLoader={htmlLoader}
                    exportToHTML={exportToHTML}
                    exportToPDF={exportToPDF}
                    pdfLoader={pdfLoader}
                    print={print}
                    selectedOutputTable={selectedOutputTable}
                    selectedLinkedObject={selectedLinkedObject}
                    dateFilters={dateFilters}
                    selectedOutputObject={selectedOutputObject}
                  />
                )}
              </>
            ) : (
              <div className={`${styles.redactorBlock} `} />
            )}
          </>
        )}

        <DocSettingsBlock
          exportPdfLoader={exportPdfLoader}
          exportButNotOpen={exportButNotOpen}
          pdfLoader={pdfLoader}
          htmlLoader={htmlLoader}
          exportToPDF={exportToPDF}
          exportToHTML={exportToHTML}
          selectedSettingsTab={selectedSettingsTab}
          selectedPaperSizeIndex={selectedPaperSizeIndex}
          setSelectedPaperSizeIndex={setSelectedPaperSizeIndex}
          setSelectedOutputTable={setSelectedOutputTable}
          selectedOutputTable={selectedOutputTable}
          selectedOutputObject={selectedOutputObject}
          setSelectedOutputObject={setSelectedOutputObject}
          templates={templates}
          selectedTemplate={selectedTemplate}
          selectedLinkedObject={selectedLinkedObject}
          setSelectedLinkedObject={setSelectedLinkedObject}
          setSelectedObject={setSelectedObject}
          selectedObject={selectedObject}
          setCustomTitle={setCustomTitle}
          customTitle={customTitle}
        />
      </div>
      {/* )} */}
    </div>
  );
};

export default DocView;
