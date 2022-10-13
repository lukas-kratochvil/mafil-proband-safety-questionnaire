import { Navigate, Route, Routes } from "react-router-dom";
import { defaultFormSchema } from "./components/form/schemas/form-schema_default";
import { operatorFormSchema } from "./components/form/schemas/form-schema_operator";
import { loadFantomFormDefaultValues } from "./components/form/util/utils";
import { useAuth } from "./hooks/auth/Auth";
import { ApprovalTablePage } from "./pages/ApprovalTablePage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RecentVisitsTablePage } from "./pages/RecentVisitsTablePage";
import { VisitDetailPage } from "./pages/VisitDetailPage";
import { WaitingRoomTablePage } from "./pages/WaitingRoomTablePage";
import { ApprovalFormPage } from "./pages/form/ApprovalFormPage";
import { DuplicationFormPage } from "./pages/form/DuplicationFormPage";
import { FantomFormPage } from "./pages/form/FantomFormPage";
import { FormPageTemplate } from "./pages/form/FormPageTemplate";
import { ProbandFormPage } from "./pages/form/ProbandFormPage";
import { WaitingRoomFormPage } from "./pages/form/WaitingRoomFormPage";

export const App = () => {
  const { operator } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/form" />}
      />
      <Route
        path="/home"
        element={<HomePage />}
      />
      <Route
        path="/form"
        element={
          <FormPageTemplate
            FormPage={ProbandFormPage}
            validationSchema={defaultFormSchema}
          />
        }
      />
      <Route
        path="/auth"
        element={<LoginPage />}
      />
      {operator && (
        <>
          <Route
            path="/auth/fantom-form"
            element={
              <FormPageTemplate
                FormPage={FantomFormPage}
                validationSchema={operatorFormSchema}
                loadDefaultValues={loadFantomFormDefaultValues}
              />
            }
          />
          <Route
            path="/auth/waiting-room"
            element={<WaitingRoomTablePage />}
          />
          <Route
            path="/auth/waiting-room/form/:id"
            element={
              <FormPageTemplate
                FormPage={WaitingRoomFormPage}
                validationSchema={operatorFormSchema}
              />
            }
          />
          <Route
            path="/auth/approval"
            element={<ApprovalTablePage />}
          />
          <Route
            path="/auth/approval/form/:id"
            element={
              <FormPageTemplate
                FormPage={ApprovalFormPage}
                validationSchema={operatorFormSchema}
              />
            }
          />
          <Route
            path="/auth/form/:id/duplication"
            element={
              <FormPageTemplate
                FormPage={DuplicationFormPage}
                validationSchema={operatorFormSchema}
              />
            }
          />
          <Route
            path="/auth/recent-visits"
            element={<RecentVisitsTablePage />}
          />
          <Route
            path="/auth/visit/:id"
            element={<VisitDetailPage />}
          />
        </>
      )}
    </Routes>
  );
};
