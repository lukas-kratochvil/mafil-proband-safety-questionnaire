import { Navigate, Route, Routes } from "react-router-dom";
import { defaultFormSchema } from "@components/form/schemas/form-schema_default";
import { operatorFormSchema } from "@components/form/schemas/form-schema_operator";
import { loadPhantomFormDefaultValues } from "@components/form/util/loaders";
import { Header } from "@components/header/Header";
import { useAuth } from "@hooks/auth/auth";
import { ApprovalRoomTablePage } from "@pages/ApprovalRoomTablePage";
import { HomePage } from "@pages/HomePage";
import { LoginPage } from "@pages/LoginPage";
import { RecentVisitsTablePage } from "@pages/RecentVisitsTablePage";
import { VisitDetailPage } from "@pages/VisitDetailPage";
import { WaitingRoomTablePage } from "@pages/WaitingRoomTablePage";
import { ApprovalFormPage } from "@pages/form/ApprovalFormPage";
import { DuplicationFormPage } from "@pages/form/DuplicationFormPage";
import { FormPageContainer } from "@pages/form/FormPageContainer";
import { PhantomFormPage } from "@pages/form/PhantomFormPage";
import { ProbandFormPage } from "@pages/form/ProbandFormPage";
import { WaitingRoomFormPage } from "@pages/form/WaitingRoomFormPage";
import { RoutingPaths } from "./routing-paths";

export const App = () => {
  const { operator } = useAuth();

  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/"
          element={<Navigate to={RoutingPaths.PROBAND_FORM} />}
        />
        <Route
          path={RoutingPaths.PROBAND_HOME}
          element={<HomePage />}
        />
        <Route
          path={RoutingPaths.PROBAND_FORM}
          element={
            <FormPageContainer
              FormPage={ProbandFormPage}
              validationSchema={defaultFormSchema}
            />
          }
        />
        <Route
          path={RoutingPaths.AUTH}
          element={<LoginPage />}
        />
        {operator && (
          <>
            <Route
              path={RoutingPaths.PHANTOM_FORM}
              element={
                <FormPageContainer
                  FormPage={PhantomFormPage}
                  validationSchema={operatorFormSchema}
                  loadDefaultValues={loadPhantomFormDefaultValues}
                />
              }
            />
            <Route
              path={RoutingPaths.WAITING_ROOM}
              element={<WaitingRoomTablePage />}
            />
            <Route
              path={`${RoutingPaths.WAITING_ROOM}/form/:id`}
              element={
                <FormPageContainer
                  FormPage={WaitingRoomFormPage}
                  validationSchema={operatorFormSchema}
                />
              }
            />
            <Route
              path={RoutingPaths.APPROVAL_ROOM}
              element={<ApprovalRoomTablePage />}
            />
            <Route
              path={`${RoutingPaths.APPROVAL_ROOM}/form/:id`}
              element={
                <FormPageContainer
                  FormPage={ApprovalFormPage}
                  validationSchema={operatorFormSchema}
                />
              }
            />
            <Route
              path={`${RoutingPaths.RECENT_VISITS}/duplicate/:id`}
              element={
                <FormPageContainer
                  FormPage={DuplicationFormPage}
                  validationSchema={operatorFormSchema}
                />
              }
            />
            <Route
              path={RoutingPaths.RECENT_VISITS}
              element={<RecentVisitsTablePage />}
            />
            <Route
              path={`${RoutingPaths.RECENT_VISITS}/visit/:id`}
              element={<VisitDetailPage />}
            />
          </>
        )}
      </Routes>
    </>
  );
};
