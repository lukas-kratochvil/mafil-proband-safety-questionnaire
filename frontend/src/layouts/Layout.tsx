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

  // when an authenticated user is on an authenticated page and enters a public URL in the address bar and redirects, user's authentication data will be cleared before the redirection
  useEffect(() => {
    if (
      operator
      // user is already authenticated so he/she will be redirected back to the authenticated part of the app (check App.tsx)
      && !location.pathname.startsWith(RoutingPath.AUTH)
      && !location.pathname.startsWith(RoutingPath.LOGIN)
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
