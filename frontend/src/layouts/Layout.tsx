import { Suspense } from "react";
import toast, { Toaster, ToastBar } from "react-hot-toast";
import { Outlet } from "react-router-dom";
import { Header } from "@app/components/header/Header";
import { SuspensePage } from "@app/pages/SuspensePage";

export const Layout = () => (
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
