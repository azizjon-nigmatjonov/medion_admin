import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import PageFallback from "../../components/PageFallback";
import constructorObjectService from "../../services/constructorObjectService";
import constructorSectionService from "../../services/constructorSectionService";
import { sortByOrder } from "../../utils/sortByOrder";
import MainInfo from "./MainInfo";
import RelationSection from "./RelationSection";
import styles from "./style.module.scss";
import Footer from "../../components/Footer";
import useTabRouter from "../../hooks/useTabRouter";
import { Save } from "@mui/icons-material";
import SecondaryButton from "../../components/Buttons/SecondaryButton";
import { useQueryClient } from "react-query";
import { sortSections } from "../../utils/sectionsOrderNumber";
import constructorViewRelationService from "../../services/constructorViewRelationService";
import PermissionWrapperV2 from "../../components/PermissionWrapper/PermissionWrapperV2";
import FiltersBlock from "../../components/FiltersBlock";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import FormCustomActionButton from "./components/CustomActionsButton/FormCustomActionButtons";
import { showAlert } from "../../store/alert/alert.thunk";
import SummarySection from "./SummarySection/SummarySection";
import FormPageBackButton from "./components/FormPageBackButton";
import { addMinutes } from "date-fns";
import { fetchConstructorTableListAction } from "../../store/constructorTable/constructorTable.thunk";

const ObjectsFormPage = () => {
  const { tableSlug, id, appId } = useParams();
  const { pathname, state = {} } = useLocation();
  const dispatch = useDispatch();
  const { removeTab, navigateToForm } = useTabRouter();
  const queryClient = useQueryClient();
  const tablesList = useSelector((state) => state.constructorTable.list);
  const isUserId = useSelector((state) => state?.auth?.userId);
  const [loader, setLoader] = useState(true);
  const [btnLoader, setBtnLoader] = useState(false);
  const [sections, setSections] = useState([]);
  const [tableRelations, setTableRelations] = useState([]);
  const navigate = useNavigate();
  const tableInfo = useMemo(() => {
    return tablesList.find((el) => el.slug === tableSlug);
  }, [tablesList, tableSlug]);
  const computedSections = useMemo(() => {
    let tabIndex = 1;
    return (
      sections
        ?.map((section) => ({
          ...section,
          fields:
            section.fields?.sort(sortByOrder).map((field) => ({
              ...field,
              tabIndex: field?.required ? tabIndex++ : 0,
            })) ?? [],
        }))
        .filter((section) => !section.is_summary_section)
        .sort(sortByOrder) ?? []
    );
  }, [sections]);

  const computedSummary = useMemo(() => {
    return sections.find((item) => item.is_summary_section);
  }, [sections]);
  const getAllData = async () => {
    const getSections = constructorSectionService.getList({
      table_slug: tableSlug,
    });

    const getFormData = constructorObjectService.getById(tableSlug, id);
    const getRelations = constructorViewRelationService.getList({
      table_slug: tableSlug,
    });

    try {
      const [
        { sections = [] },
        { data = {} },
        { relations: view_relations = [] },
      ] = await Promise.all([getSections, getFormData, getRelations]);
      if (data.balance) {
        setFormValue("balance", data.balance || 0);
      }
      setSections(sortSections(sections));

      // setTableRelations(relations?.sort(sortByOrder)?.map(el => el.relation ?? el?.view_relation_type === 'FILE' ? el : {}))

      const relations =
        view_relations?.map((el) => ({
          ...el,
          ...el.relation,
        })) ?? [];

      setTableRelations(
        relations.map((relation) => ({
          ...relation,
          relatedTable:
            relation.table_from?.slug === tableSlug
              ? relation.table_to?.slug
              : relation.table_from?.slug,
        }))
      );

      reset(data.response ?? {});

      // const hasCurrentTab = tabs?.some((tab) => tab.link === location.pathname)

      // if (!hasCurrentTab) addNewTab(appId, tableSlug, id, data.response)
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const getFields = async () => {
    try {
      const getSections = constructorSectionService.getList({
        table_slug: tableSlug,
      });

      const getRelations = constructorViewRelationService.getList({
        table_slug: tableSlug,
        // relation_table_slug: tableSlug
      });

      const [{ sections = [] }, { relations: view_relations = [] }] =
        await Promise.all([getSections, getRelations]);

      setSections(sortSections(sections));

      const relations =
        view_relations?.map((el) => ({
          ...el,
          ...el.relation,
        })) ?? [];

      setTableRelations(
        relations.map((relation) => ({
          ...relation,
          relatedTable:
            relation.table_from?.slug === tableSlug
              ? relation.table_to?.slug
              : relation.table_from?.slug,
        }))
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const update = (data) => {
    setBtnLoader(true);

    constructorObjectService
      .update(tableSlug, { data })
      .then(() => {
        queryClient.invalidateQueries(["GET_OBJECT_LIST", tableSlug]);
        dispatch(showAlert("Успешно обновлено", "success"));
        if (tableSlug === "patient_deposite") {
          navigate(-1);
        }
      })
      .catch((e) => {})
      .finally(() => setBtnLoader(false));
  };

  const create = (data) => {
    setBtnLoader(true);

    constructorObjectService
      .create(tableSlug, { data })
      .then((res) => {
        queryClient.invalidateQueries(["GET_OBJECT_LIST", tableSlug]);
        queryClient.refetchQueries("GET_NOTIFICATION_LIST", tableSlug, {
          table_slug: tableSlug,
          user_id: isUserId,
        });
        dispatch(showAlert("Успешно обновлено", "success"));
        // if (!state) navigateToForm(tableSlug, "EDIT", res.data?.data)
        if (tableSlug === "patient_deposite") {
          navigate(-1);
        }
        if (tableRelations?.length)
          navigateToForm(tableSlug, "EDIT", res.data?.data);
      })
      .catch((e) => {})
      .finally(() => {
        setBtnLoader(false);
      });
  };

  const onSubmit = (data) => {
    if (id) update(data);
    else {
      create(data);
    }
  };

  useEffect(() => {
    if (!tableInfo) return;
    if (id) getAllData();
    else getFields();
  }, [id, tableInfo]);

  const {
    handleSubmit,
    control,
    reset,
    setValue: setFormValue,
    watch,
  } = useForm({
    defaultValues: state,
  });

  // Automatic setValue for End of Session

  const serviceTime = watch("service_time");
  const startTime = watch("date_start");

  useEffect(() => {
    setFormValue(
      "time_end",
      addMinutes(new Date(startTime), parseInt(serviceTime))
    );
  }, [serviceTime, startTime]);

  if (loader) return <PageFallback />;

  return (
    <div className={styles.formPage}>
      <FiltersBlock
        summary={true}
        sections={sections}
        // extra={<DocumentGeneratorButton />}
        hasBackground={true}
      >
        <FormPageBackButton />
        <SummarySection
          computedSummary={computedSummary}
          control={control}
          sections={sections}
        />
      </FiltersBlock>
      <div className={styles.formArea}>
        <MainInfo
          control={control}
          computedSections={computedSections}
          setFormValue={setFormValue}
        />
        <div className={styles.secondaryCardSide}>
          <RelationSection relations={tableRelations} control={control} />
        </div>
      </div>
      <Footer
        extra={
          <>
            <SecondaryButton onClick={() => removeTab(pathname)} color="error">
              Закрыть
            </SecondaryButton>

            <PermissionWrapperV2 tabelSlug={tableSlug} type="update">
              <FormCustomActionButton
                control={control?._formValues}
                tableSlug={tableSlug}
                id={id}
              />

              {/* {customEvents?.map((event) => (
                <PrimaryButton
                  key={event.id}
                  onClick={() => invokeFunction(event)}
                >
                  <IconGenerator icon={event.icon} /> {event.label}
                </PrimaryButton>
              ))} */}
              <PermissionWrapperV2 tableSlug={tableSlug} type="update">
                <PrimaryButton
                  loader={btnLoader}
                  id="submit"
                  onClick={handleSubmit(onSubmit)}
                >
                  <Save />
                  Сохранить
                </PrimaryButton>
              </PermissionWrapperV2>
            </PermissionWrapperV2>
          </>
        }
      />
    </div>
  );
};

export default ObjectsFormPage;
