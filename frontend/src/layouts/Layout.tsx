import { Suspense, useEffect, useState } from "react";
import toast, { Toaster, ToastBar } from "react-hot-toast";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Header } from "@app/components/header/Header";
import { useAuth } from "@app/hooks/auth/auth";
import { SuspensePage } from "@app/pages/SuspensePage";
import { RoutingPath } from "@app/routing-paths";

export const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { operator, clearAuth } = useAuth();
  const [isAuthSolved, setIsAuthSolved] = useState(false);

  useEffect(
    () =>
      // when the user clicks the back button directly after login, he will be redirected on the public (unauthenticated) page so we need to clear the authentication data when unmounting the `PrivateLayout`
      () => {
        if (operator && !location.pathname.startsWith(RoutingPath.AUTH)) {
          void clearAuth();
          navigate(RoutingPath.LOGIN);
          return;
        }

        setIsAuthSolved(true);
      },
    [clearAuth, location, navigate, operator]
  );

  if (!isAuthSolved) {
    return <SuspensePage />;
  }

  return (
    <>
      <Header />
      {/* Toaster displays errors at the top of the page */}
      <Toaster>
        {(t) => (
          // TODO: create good-looking toast
          <ToastBar toast={t}>
            {({ icon, message }) => (
              <>
                {icon}
                {message}
                {t.type !== "loading" && (
                  <button
                    type="button"
                    onClick={() => toast.dismiss(t.id)}
                  >
                    X
                  </button>
                )}
              </>
            )}
          </ToastBar>
        )}
      </Toaster>
      <main>
        <Suspense fallback={<SuspensePage />}>
          <Outlet />
        </Suspense>
      </main>
    </>
  );
};
