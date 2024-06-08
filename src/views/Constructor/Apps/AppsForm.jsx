import { Save, Upload } from "@mui/icons-material";
import { useEffect, useMemo, useRef } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../../components/Buttons/SecondaryButton";
import Footer from "../../../components/Footer";
import FormCard from "../../../components/FormCard";
import FRow from "../../../components/FormElements/FRow";
import HFIconPicker from "../../../components/FormElements/HFIconPicker";
import HFTextField from "../../../components/FormElements/HFTextField";
import HeaderSettings from "../../../components/HeaderSettings";
import PageFallback from "../../../components/PageFallback";
import PermissionWrapperV2 from "../../../components/PermissionWrapper/PermissionWrapperV2";
import applicationService from "../../../services/applicationSercixe";
import { fetchApplicationListActions } from "../../../store/application/application.thunk";
import TablesList from "../Tables/TablesList";
import RectangleIconButton from "../../../components/Buttons/RectangleIconButton";
import exportToJsonService from "../../../services/exportToJson";
import useDownloader from "../../../hooks/useDownloader";
import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/Upload";
import FileUpload from "../../../components/Upload/FileUpload";
import fileService from "../../../services/fileService";

const applicationListPageLink = "/settings/constructor/apps";

const AppsForm = () => {
  const { appId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [search, setSearch] = useSearchParams();
  const [btnLoader, setBtnLoader] = useState();
  const [loader, setLoader] = useState(true);
  const [appData, setAppData] = useState({});
  const [ids, setIds] = useState([]);
  // const { download } = useDownloader();
  const ref = useRef();

  const mainForm = useForm({
    defaultValues: {
      description: "",
      icon: "",
      name: "",
      table_ids: [],
    },
  });

  const createApp = (data) => {
    setBtnLoader(true);

    applicationService
      .create(data)
      .then(() => {
        navigate(applicationListPageLink);
        dispatch(fetchApplicationListActions());
      })
      .catch(() => setBtnLoader(false));
  };

  const updateApp = (data) => {
    setBtnLoader(true);

    applicationService
      .update({
        ...data,
      })
      .then(() => {
        navigate(applicationListPageLink);
        dispatch(fetchApplicationListActions());
      })
      .catch(() => setBtnLoader(false));
  };

  const getData = () => {
    setLoader(true);

    applicationService
      .getById(appId)
      .then((res) => {
        const computedData = {
          ...mainForm.getValues(),
          ...res,
          table_ids: res.tables?.map((table) => table.id) ?? [],
        };
        mainForm.reset(computedData);
        setAppData(computedData);
      })
      .finally(() => setLoader(false));
  };

  // Export to Json
  // const exportToJson = async () => {
  //   await exportToJsonService
  //     .postToJson({
  //       table_ids: ids,
  //     })
  //     .then((res) => {
  //       download({
  //         link: "https://" + res?.link,
  //         fileName: res?.link.split("/").pop(),
  //       });
  //     })
  //     .catch((err) => {
  //       console.log("exportToJson error", err);
  //     });
  // };

  // const inputChangeHandler = (e) => {
  //   const file = e.target.files[0];

  //   const data = new FormData();
  //   data.append("file", file);

  //   fileService.upload(data).then((res) => {
  //     fileSend(res?.filename);
  //   });
  // };

  // const fileSend = (value) => {
  //   exportToJsonService.uploadToJson({
  //     file_name: value,
  //     app_id: appId,
  //   });
  // };

  useEffect(() => {
    if (appId) getData();
    else setLoader(false);
  }, []);

  const onSubmit = (data) => {
    const tables = data?.tables?.map((table) => ({
      table_id: table.id,
      is_own_table: Boolean(table.is_own_table),
      is_visible: Boolean(table.is_visible),
    }));

    const computedData = {
      ...data,
      tables,
    };

    if (appId) updateApp(computedData);
    else createApp(computedData);
  };

  if (loader) return <PageFallback />;

  return (
    <div>
      <Tabs
        selectedIndex={Number(search.get("tab") ?? 0)}
        onSelect={(index) => setSearch({ tab: index })}
        direction={"ltr"}
        style={{ height: "100vh", position: "relative" }}
      >
        <HeaderSettings
          title="Приложение"
          backButtonLink={applicationListPageLink}
          subtitle={appId ? mainForm.watch("name") : "Новый"}
        >
          <TabList>
            <Tab>Details</Tab>
            {appId && <Tab>Objects</Tab>}
          </TabList>
          {/* {ids?.length > 0 && (
            <div
              style={{
                position: "absolute",
                right: "150px",
                zIndex: 999,
                top: "13px",
              }}
              title="Download"
            >
              <RectangleIconButton color="white" onClick={() => exportToJson()}>
                <DownloadIcon />
              </RectangleIconButton>
            </div>
          )} */}
          {/* 
          <div
            style={{
              position: "absolute",
              right: "110px",
              zIndex: 999,
              top: "13px",
            }}
            title="Upload"
          >
            <RectangleIconButton
              color="white"
              onClick={() => ref.current.click()}
            >
              <input
                ref={ref}
                style={{ display: "none" }}
                type="file"
                accept=".json"
                onChange={inputChangeHandler}
              />
              <UploadIcon />
            </RectangleIconButton>
          </div> */}
        </HeaderSettings>

        <TabPanel>
          <form
            onSubmit={mainForm.handleSubmit(onSubmit)}
            className="p-2"
            style={{ height: "calc(100vh - 112px)", overflow: "auto" }}
          >
            <FormCard title="Детали" maxWidth={500}>
              <FRow
                label={"Названия"}
                componentClassName="flex gap-2 align-center"
                required
              >
                <HFIconPicker
                  name="icon"
                  control={mainForm.control}
                  shape="rectangle"
                />
                <HFTextField
                  disabledHelperText
                  name="name"
                  control={mainForm.control}
                  fullWidth
                  required
                />
              </FRow>

              <FRow label="Описания">
                <HFTextField
                  name="description"
                  control={mainForm.control}
                  multiline
                  rows={4}
                  fullWidth
                />
              </FRow>
            </FormCard>
          </form>

          <Footer
            extra={
              <>
                <SecondaryButton
                  onClick={() => navigate(applicationListPageLink)}
                  color="error"
                >
                  Закрыть
                </SecondaryButton>
                <PermissionWrapperV2 tabelSlug="app" type="update">
                  <PrimaryButton
                    loader={btnLoader}
                    onClick={mainForm.handleSubmit(onSubmit)}
                  >
                    <Save /> Сохранить
                  </PrimaryButton>
                </PermissionWrapperV2>
              </>
            }
          />
        </TabPanel>

        {appId && (
          <TabPanel>
            <TablesList
              mainForm={mainForm}
              appData={appData}
              getData={getData}
              setIds={setIds}
            />
          </TabPanel>
        )}
      </Tabs>
    </div>
  );
};

export default AppsForm;
