import { Navigate, Route, Routes } from "react-router-dom";
import { defaultFormSchema } from "./components/form/schemas/form-schema_default";
import { operatorFormSchema } from "./components/form/schemas/form-schema_operator";
import { loadPhantomFormDefaultValues } from "./components/form/util/loaders";
import { Header } from "./components/header/Header";
import { useAuth } from "./hooks/auth/auth";
import { ApprovalRoomTablePage } from "./pages/ApprovalRoomTablePage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RecentVisitsTablePage } from "./pages/RecentVisitsTablePage";
import { VisitDetailPage } from "./pages/VisitDetailPage";
import { WaitingRoomTablePage } from "./pages/WaitingRoomTablePage";
import { ApprovalFormPage } from "./pages/form/ApprovalFormPage";
import { DuplicationFormPage } from "./pages/form/DuplicationFormPage";
import { FormPageContainer } from "./pages/form/FormPageContainer";
import { PhantomFormPage } from "./pages/form/PhantomFormPage";
import { ProbandFormPage } from "./pages/form/ProbandFormPage";
import { WaitingRoomFormPage } from "./pages/form/WaitingRoomFormPage";

export enum UrlBasePaths {
  PROBAND_HOME = "/home",
  PROBAND_FORM = "/form",
  AUTH = "/auth",
  PHANTOM_FORM = "/auth/phantom-form",
  WAITING_ROOM = "/auth/waiting-room",
  APPROVAL_ROOM = "/auth/approval-room",
  RECENT_VISITS = "/auth/recent-visits",
}

export const App = () => {
  const { operator } = useAuth();

  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/"
          element={<Navigate to={UrlBasePaths.PROBAND_FORM} />}
        />
        <Route
          path={UrlBasePaths.PROBAND_HOME}
          element={<HomePage />}
        />
        <Route
          path={UrlBasePaths.PROBAND_FORM}
          element={
            <FormPageContainer
              FormPage={ProbandFormPage}
              validationSchema={defaultFormSchema}
            />
          }
        />
        <Route
          path={UrlBasePaths.AUTH}
          element={<LoginPage />}
        />
        {operator && (
          <>
            <Route
              path={UrlBasePaths.PHANTOM_FORM}
              element={
                <FormPageContainer
                  FormPage={PhantomFormPage}
                  validationSchema={operatorFormSchema}
                  loadDefaultValues={loadPhantomFormDefaultValues}
                />
              }
            />
            <Route
              path={UrlBasePaths.WAITING_ROOM}
              element={<WaitingRoomTablePage />}
            />
            <Route
              path={`${UrlBasePaths.WAITING_ROOM}/form/:id`}
              element={
                <FormPageContainer
                  FormPage={WaitingRoomFormPage}
                  validationSchema={operatorFormSchema}
                />
              }
            />
            <Route
              path={UrlBasePaths.APPROVAL_ROOM}
              element={<ApprovalRoomTablePage />}
            />
            <Route
              path={`${UrlBasePaths.APPROVAL_ROOM}/form/:id`}
              element={
                <FormPageContainer
                  FormPage={ApprovalFormPage}
                  validationSchema={operatorFormSchema}
                />
              }
            />
            <Route
              path={`${UrlBasePaths.RECENT_VISITS}/duplicate/:id`}
              element={
                <FormPageContainer
                  FormPage={DuplicationFormPage}
                  validationSchema={operatorFormSchema}
                />
              }
            />
            <Route
              path={UrlBasePaths.RECENT_VISITS}
              element={<RecentVisitsTablePage />}
            />
            <Route
              path={`${UrlBasePaths.RECENT_VISITS}/visit/:id`}
              element={<VisitDetailPage />}
            />
          </>
        )}
      </Routes>
    </>
  );
};
