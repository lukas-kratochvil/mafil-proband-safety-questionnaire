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
  const [isAuthSolved, setIsAuthSolved] = useState<boolean>(false);

  /**
   * An authenticated user will not be logged out after clicking (multiple times) on the browser's back button and will remain in the authenticated part of the application.
   * When an authenticated user is on an authenticated page and enters a public URL in the address bar and redirects, user's authentication data will be cleared before the redirection.
   */
  useEffect(() => {
    if (
      operator
      && !location.pathname.startsWith(RoutingPath.AUTH)
      // '/oidc-login' calls `logInCallback()` which obtains user data from the OIDC provider after successful authentication
      && !location.pathname.startsWith(RoutingPath.OIDC_LOGIN)
    ) {
      void clearAuth();
      navigate(location.pathname);
      return;
    }

    setIsAuthSolved(true);
  }, [clearAuth, location, navigate, operator]);

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
