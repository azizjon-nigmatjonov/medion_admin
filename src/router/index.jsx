import { lazy, Suspense, useMemo } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import KeepAliveWrapper from "../components/KeepAliveWrapper";
import PageFallback from "../components/PageFallback";
import ReloadWrapper from "../components/ReloadWrapper";
import AnalyticsLayout from "../layouts/AnalyticsLayout";

import CashboxLayout from "../layouts/CashboxLayout";
import MainLayout from "../layouts/MainLayout";
import SettingsLayout from "../layouts/SettingsLayout";
import DashboardList from "../views/Analytics/Dashboard";
import DashboardCreatePage from "../views/Analytics/Dashboard/DashboardCreatePage";
import DashboardSettings from "../views/Analytics/Dashboard/DashboardSettings";
import DashboardMainInfo from "../views/Analytics/Dashboard/DashboardSettings/DashboardMainInfo";
import VariableCreateForm from "../views/Analytics/Dashboard/DashboardSettings/VariableCreateForm";
import Variables from "../views/Analytics/Dashboard/DashboardSettings/Variables";
import DashboardDetailPage from "../views/Analytics/Dashboard/Detail";
import PanelCreateForm from "../views/Analytics/Dashboard/Detail/PanelForm";
import Login from "../views/Auth/Login";
import Registration from "../views/Auth/Registration";
import CashboxAppointments from "../views/Cashbox/Appointments";
import AppointmentsForm from "../views/Cashbox/Appointments/Form";
import CashboxClosing from "../views/Cashbox/Closing";
import CashboxOpening from "../views/Cashbox/Opening";
import AppsPage from "../views/Constructor/Apps";
import AppsForm from "../views/Constructor/Apps/AppsForm";
import ConstructorTablesFormPage from "../views/Constructor/Tables/Form";
import ObjectsPage from "../views/Objects";
import ObjectsFormPage from "../views/Objects/ObjectsFormPage";
import ReloadPage from "../components/ReloadComponent/index";
import ReloadRelations from "@/components/ReloadRelations";

const AuthLayout = lazy(() => import("../layouts/AuthLayout"));

const AuthMatrix = lazy(() => import("../views/AuthMatrix"));
const ClientPlatform = lazy(() => import("../views/AuthMatrix/ClientPlatform"));
const ClientType = lazy(() => import("../views/AuthMatrix/ClientType"));
const CrossedPage = lazy(() => import("../views/AuthMatrix/Crossed"));
const RolesForm = lazy(() => import("../views/AuthMatrix/Crossed/Roles/Form"));
const Profile = lazy(() => import("../views/AuthMatrix/Crossed/Profile/index"));

const IntegrationsForm = lazy(() =>
  import("../views/AuthMatrix/Crossed/Integrations/Form")
);
const SessionsPage = lazy(() =>
  import("../views/AuthMatrix/Crossed/Integrations/Sessions")
);
const UsersForm = lazy(() => import("../views/Users/Form"));
const UsersPage = lazy(() => import("../views/Users/index"));
const MatrixPage = lazy(() => import("../views/Matrix"));
const MatrixDetail = lazy(() => import("../views/Matrix/MatrixDetail"));
const MatrixRolePage = lazy(() => import("../views/Matrix/MatrixRolePage"));

const Router = () => {
  const location = useLocation();
  const isAuth = useSelector((state) => state.auth.isAuth);
  const applications = useSelector((state) => state.application.list);
  const cashbox = useSelector((state) => state.cashbox.data);

  const cashboxIsOpen = cashbox.is_open === "Открыто";

  const redirectLink = useMemo(() => {
    if (location.pathname.includes("settings"))
      return "/settings/constructor/apps";
    if (location.pathname.includes("cashbox")) return "/cashbox/appointments";
    if (!applications.length) return "/settings/constructor/apps";
    return `/main/${applications[0].id}`;
  }, [location.pathname, applications]);

  if (!isAuth)
    return (
      <Suspense fallback={<p> Loading...</p>}>
        <Routes>
          <Route path="/" element={<AuthLayout />}>
            <Route index element={<Navigate to="/login " />} />
            <Route path="login" element={<Login />} />
            <Route path="registration" element={<Registration />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Suspense>
    );

  return (
    <Routes>
      {/* <Route path="remote" element={<Suspense fallback="Loading..." > <SafeComponent><FileSystemModule /></SafeComponent></Suspense>} /> */}

      <Route path="/main" element={<MainLayout />}>
        <Route index element={<Navigate to={redirectLink} />} />

        <Route path=":appId" element={<div></div>} />

        <Route
          path=":appId/object/:tableSlug"
          element={<ReloadWrapper component={ObjectsPage} />}
        />

        <Route
          path=":appId/object/:tableSlug/create/:formId"
          element={
            <KeepAliveWrapper>
              <ObjectsFormPage />
            </KeepAliveWrapper>
          }
        />
        <Route
          path=":appId/object/:tableSlug/:id"
          element={
            <KeepAliveWrapper>
              <ObjectsFormPage />
            </KeepAliveWrapper>
          }
        />

        <Route path="*" element={<Navigate to={redirectLink} />} />
      </Route>

      {/* ---------SETTINGS APP---------------- */}

      <Route path="settings" element={<SettingsLayout />}>
        <Route index element={<Navigate to={"/settings/constructor/apps"} />} />

        <Route path="constructor/apps" element={<AppsPage />} />
        <Route path="constructor/apps/create" element={<AppsForm />} />
        <Route path="constructor/apps/:appId" element={<AppsForm />} />

        {/* <Route path="constructor/objects" element={<ConstructorTablesListPage />} /> */}
        <Route
          path="constructor/apps/:appId/objects/create"
          element={<ConstructorTablesFormPage />}
        />
        <Route
          path="constructor/apps/:appId/objects/:id/:slug"
          element={<ConstructorTablesFormPage />}
        />

        <Route
          path="auth/users"
          element={
            <Suspense fallback={<PageFallback />}>
              <UsersPage />
            </Suspense>
          }
        />
        <Route
          path="auth/users/create"
          element={
            <Suspense fallback={<PageFallback />}>
              {/* <UsersForm /> */}
            </Suspense>
          }
        />
        <Route
          path="auth/users/:userId"
          element={
            <Suspense fallback={<PageFallback />}>
              <UsersForm />
            </Suspense>
          }
        />

        {/* -------------AUTH MATRIX------------ */}

        <Route
          path="auth/matrix/profile/crossed"
          element={
            <Suspense fallback={<PageFallback />}>
              <Profile />
            </Suspense>
          }
        />

        <Route
          path="auth/matrix/:projectId"
          element={
            <Suspense fallback={<PageFallback />}>
              <AuthMatrix />
            </Suspense>
          }
        />
        <Route
          path="auth/matrix/:projectId/platform/:platformId"
          element={
            <Suspense fallback={<PageFallback />}>
              <ClientPlatform />
            </Suspense>
          }
        />
        <Route
          path="auth/matrix/:projectId/client-type/:typeId"
          element={
            <Suspense fallback={<PageFallback />}>
              <ClientType />
            </Suspense>
          }
        />
        <Route
          path="auth/matrix/:projectId/:platformId/:typeId/crossed"
          element={
            <Suspense fallback={<PageFallback />}>
              <CrossedPage />
            </Suspense>
          }
        />

        <Route
          path="auth/matrix/:projectId/:platformId/:typeId/crossed/user/create"
          element={
            <Suspense fallback={<PageFallback />}>
              <UsersForm />
            </Suspense>
          }
        />
        <Route
          path="auth/matrix/:projectId/:platformId/:typeId/crossed/user/:userId"
          element={
            <Suspense fallback={<PageFallback />}>
              <UsersForm />
            </Suspense>
          }
        />

        <Route
          path="auth/matrix/:projectId/:platformId/:typeId/crossed/role/create"
          element={
            <Suspense fallback={<PageFallback />}>
              <RolesForm />
            </Suspense>
          }
        />
        <Route
          path="auth/matrix/:projectId/:platformId/:typeId/crossed/role/:roleId"
          element={
            <Suspense fallback={<PageFallback />}>
              <RolesForm />
            </Suspense>
          }
        />

        <Route
          path="auth/matrix/:projectId/:platformId/:typeId/crossed/integration/create"
          element={
            <Suspense fallback={<PageFallback />}>
              <IntegrationsForm />
            </Suspense>
          }
        />
        <Route
          path="auth/matrix/:projectId/:platformId/:typeId/crossed/integration/:integrationId"
          element={
            <Suspense fallback={<PageFallback />}>
              <IntegrationsForm />
            </Suspense>
          }
        />
        <Route
          path="auth/matrix/:projectId/:platformId/:typeId/crossed/integration/:integrationId/sessions"
          element={
            <Suspense fallback={<PageFallback />}>
              <SessionsPage />
            </Suspense>
          }
        />
        <Route
          path="auth/matrix_v2"
          element={
            <Suspense fallback={<PageFallback />}>
              <MatrixPage />
            </Suspense>
          }
        />
        <Route
          path="auth/matrix_v2/:typeId/:platformId"
          element={
            <Suspense fallback={<PageFallback />}>
              <MatrixDetail />
            </Suspense>
          }
        />
        <Route
          path="auth/matrix_v2/role/:roleId/:typeId"
          element={
            <Suspense fallback={<PageFallback />}>
              <MatrixRolePage />
            </Suspense>
          }
        />
      </Route>

      {/* ---------ANALYTICS APP---------------- */}

      <Route path="analytics" element={<AnalyticsLayout />}>
        <Route index element={<Navigate to={"/analytics/dashboard"} />} />

        <Route path="dashboard" element={<DashboardList />} />

        <Route
          path="dashboard/create/:formId"
          element={
            <KeepAliveWrapper>
              <DashboardCreatePage />
            </KeepAliveWrapper>
          }
        />
        <Route path="dashboard/:id" element={<DashboardDetailPage />} />

        <Route path="dashboard/:id/panel">
          <Route path=":panelId" element={<PanelCreateForm />} />
          <Route path="create" element={<PanelCreateForm />} />
        </Route>

        <Route path="dashboard/:id/settings" element={<DashboardSettings />}>
          <Route path="main" element={<DashboardMainInfo />} />
          <Route path="variables" element={<Variables />} />
          <Route path="variables/create" element={<VariableCreateForm />} />
          <Route
            path="variables/:variableId"
            element={<VariableCreateForm />}
          />
        </Route>

        <Route path="*" element={<Navigate to={"/analytics/dashboard"} />} />
      </Route>

      <Route path="/cashbox" element={<CashboxLayout />}>
        <Route
          index
          element={
            <Navigate
              to={!cashboxIsOpen ? "/cashbox/opening" : "/cashbox/appointments"}
            />
          }
        />

        {cashboxIsOpen ? (
          <>
            <Route path="closing" element={<CashboxClosing />} />

            <Route path="appointments" element={<CashboxAppointments />} />
            <Route
              path="appointments/:type/:id"
              element={
                <KeepAliveWrapper>
                  <AppointmentsForm />
                </KeepAliveWrapper>
              }
            />
          </>
        ) : (
          <Route path="opening" element={<CashboxOpening />} />
        )}

        <Route
          path="*"
          element={
            <Navigate
              to={!cashboxIsOpen ? "/cashbox/opening" : "/cashbox/appointments"}
            />
          }
        />
      </Route>

      <Route path="*" element={<Navigate to={redirectLink} />} />
      <Route path="reload" element={<ReloadPage />} />
      <Route path="reloadRelations" element={<ReloadRelations />} />
    </Routes>
  );
};

export default Router;
