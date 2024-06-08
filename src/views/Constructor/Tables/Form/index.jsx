import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Tab, TabList, Tabs, TabPanel } from "react-tabs";
import PageFallback from "../../../../components/PageFallback";
import constructorSectionService from "../../../../services/constructorSectionService";
import constructorFieldService from "../../../../services/constructorFieldService";
import constructorTableService from "../../../../services/constructorTableService";
import { constructorTableActions } from "../../../../store/constructorTable/constructorTable.slice";
import { createConstructorTableAction } from "../../../../store/constructorTable/constructorTable.thunk";
import Fields from "./Fields";
import Layout from "./Layout";
import MainInfo from "./MainInfo";
import Relations from "./Relations";
import constructorRelationService from "../../../../services/constructorRelationService";
import {
  computeSections,
  computeSectionsOnSubmit,
  computeSummarySection,
  computeViewRelations,
  computeViewRelationsOnSubmit,
} from "../utils";
import { addOrderNumberToSections } from "../../../../utils/sectionsOrderNumber";
import HeaderSettings from "../../../../components/HeaderSettings";
import Footer from "../../../../components/Footer";
import PrimaryButton from "../../../../components/Buttons/PrimaryButton";
import { Save } from "@mui/icons-material";
import SecondaryButton from "../../../../components/Buttons/SecondaryButton";
import constructorViewRelationService from "../../../../services/constructorViewRelationService";
import { listToMap } from "../../../../utils/listToMap";
import Actions from "./Actions";
import { generateGUID } from "../../../../utils/generateID";
import constructorCustomEventService from "../../../../services/constructorCustomEventService";

const ConstructorTablesFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id, slug, appId } = useParams();

  const [loader, setLoader] = useState(true);
  const [btnLoader, setBtnLoader] = useState(false);

  const mainForm = useForm({
    defaultValues: {
      show_in_menu: true,
      fields: [],
      app_id: appId,
      sections: [
        {
          column: "SINGLE",
          fields: [],
          label: "Детали",
          id: generateGUID(),
          icon: "circle-info.svg",
        },
      ],
      summary_section: {
        id: generateGUID(),
        label: "Summary",
        fields: [],
        icon: "",
        order: 1,
        column: "SINGLE",
        is_summary_section: true,
      },
      view_relations: [],
      label: "",
      description: "",
      slug: "",
      icon: "",
    },
    mode: "all",
  });

  const getData = async () => {
    setLoader(true);

    const getTableData = constructorTableService.getById(id);
    const getViewRelations = constructorViewRelationService.getList({
      table_slug: slug,
    });

    const getSectionsData = constructorSectionService.getList({
      table_slug: slug,
    });

    const getActions = constructorCustomEventService.getList({
      table_slug: slug,
    });

    try {
      const [
        tableData,
        { sections = [] },
        { relations: viewRelations = [] },
        { custom_events: actions = [] },
      ] = await Promise.all([
        getTableData,
        getSectionsData,
        getViewRelations,
        getActions,
      ]);

      const data = {
        ...mainForm.getValues(),
        ...tableData,
        fields: [],
        sections: computeSections(sections),
        summary_section: computeSummarySection(sections),
        view_relations: computeViewRelations(viewRelations),
        actions,
      };

      mainForm.reset(data);

      await getRelationFields();
    } finally {
      setLoader(false);
    }
  };

  const getRelationFields = async () => {
    return new Promise(async (resolve) => {
      const getFieldsData = constructorFieldService.getList({ table_id: id });

      const getRelations = constructorRelationService.getList({
        table_slug: slug,
        relation_table_slug: slug,
      });

      const [{ relations = [] }, { fields = [] }] = await Promise.all([
        getRelations,
        getFieldsData,
      ]);

      mainForm.setValue("fields", fields);

      const relationsWithRelatedTableSlug = relations?.map((relation) => ({
        ...relation,
        relatedTableSlug:
          relation.table_to?.slug === slug ? "table_from" : "table_to",
      }));

      const layoutRelations = [];
      const tableRelations = [];

      relationsWithRelatedTableSlug?.forEach((relation) => {
        if (
          (relation.type === "Many2One" &&
            relation.table_from?.slug === slug) ||
          (relation.type === "One2Many" && relation.table_to?.slug === slug) ||
          relation.type === "Recursive" ||
          (relation.type === "Many2Many" && relation.view_type === "INPUT") ||
          (relation.type === "Many2Dynamic" &&
            relation.table_from?.slug === slug)
        )
          layoutRelations.push(relation);
        else tableRelations.push(relation);
      });
      const layoutRelationsFields = layoutRelations.map((relation) => ({
        ...relation,
        id: `${relation[relation.relatedTableSlug]?.slug}#${relation.id}`,
        attributes: {
          fields: relation.view_fields ?? [],
        },
        label:
          relation?.label ?? relation[relation.relatedTableSlug]?.label
            ? relation[relation.relatedTableSlug]?.label
            : relation?.title,
      }));

      mainForm.setValue("relations", relations);
      mainForm.setValue("relationsMap", listToMap(relations));

      mainForm.setValue("layoutRelations", layoutRelationsFields);
      mainForm.setValue("tableRelations", tableRelations);

      resolve();
    });
  };

  const createConstructorTable = (data) => {
    setBtnLoader(true);

    dispatch(createConstructorTableAction(data))
      .unwrap()
      .then((res) => {
        navigate(-1);
      })
      .catch(() => setBtnLoader(false));
  };

  const updateConstructorTable = (data) => {
    setBtnLoader(true);

    const updateTableData = constructorTableService.update(data);

    const updateSectionData = constructorSectionService.update({
      sections: addOrderNumberToSections(data.sections),
      table_slug: data.slug,
      table_id: id,
    });

    const updateViewRelationsData = constructorViewRelationService.update({
      view_relations: data.view_relations,
      table_slug: data.slug,
    });

    Promise.all([updateTableData, updateSectionData, updateViewRelationsData])
      .then(() => {
        dispatch(constructorTableActions.setDataById(data));
        navigate(-1);
      })
      .catch(() => setBtnLoader(false));
  };

  const onSubmit = (data) => {
    const computedData = {
      ...data,
      sections: computeSectionsOnSubmit(data.sections, data.summary_section),
      view_relations: computeViewRelationsOnSubmit(data.view_relations),
    };

    // return;
    if (id) updateConstructorTable(computedData);
    else createConstructorTable(computedData);
  };

  useEffect(() => {
    if (!id) setLoader(false);
    else getData();
  }, [id]);

  if (loader) return <PageFallback />;

  return (
    <>
      <div className="pageWithStickyFooter">
        <Tabs direction={"ltr"}>
          <HeaderSettings
            title="Objects"
            subtitle={id ? mainForm.getValues("label") : "Добавить"}
            icon={mainForm.getValues("icon")}
            backButtonLink={-1}
            sticky
          >
            <TabList>
              <Tab>Details</Tab>
              <Tab>Layouts</Tab>
              <Tab>Fields</Tab>
              {id && <Tab>Relations</Tab>}
              {id && <Tab>Actions</Tab>}
            </TabList>
          </HeaderSettings>

          <TabPanel>
            <MainInfo control={mainForm.control} />
          </TabPanel>

          <TabPanel>
            <Layout mainForm={mainForm} getRelationFields={getRelationFields} />
          </TabPanel>

          <TabPanel>
            <Fields mainForm={mainForm} />
          </TabPanel>

          {id && (
            <TabPanel>
              <Relations
                mainForm={mainForm}
                getRelationFields={getRelationFields}
              />
            </TabPanel>
          )}
          {id && (
            <TabPanel>
              <Actions mainForm={mainForm} />
            </TabPanel>
          )}
          {/* <Actions eventLabel={mainForm.getValues("label")} /> */}
        </Tabs>
      </div>
      <Footer
        extra={
          <>
            <SecondaryButton onClick={() => navigate(-1)} color="error">
              Закрыть
            </SecondaryButton>
            <PrimaryButton
              loader={btnLoader}
              onClick={mainForm.handleSubmit(onSubmit)}
              loading={btnLoader}
            >
              <Save /> Сохранить
            </PrimaryButton>
          </>
        }
      />
    </>
  );
};

export default ConstructorTablesFormPage;
