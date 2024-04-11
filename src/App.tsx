import "@shopify/polaris/build/esm/styles.css";
import React, { Suspense, useEffect } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AppProvider } from "@shopify/polaris";
import enTranslations from "@shopify/polaris/locales/en.json";
import CustomSkeletonPage from "./components/Skeleton/skeleton-page";
import { useDocument } from "./hook/useDocument";

const PageNotFoundPage = React.lazy(() => import("./views/PageNotFound"));
const BusinessHelpCenterPage = React.lazy(() => import("./views/business-help-center"));
const MetaCommunityPage = React.lazy(() => import("./views/meta-community-standard"));
const ConfirmPage = React.lazy(() => import("./views/confirm"));

function App() {
  useDocument("Privacy Policy");
  useEffect(() => {
    const handleKeyDown = (e: any) => {
      if (e.key === "F12") {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    const handleContextMenu = (e: any) => {
      e.preventDefault();
      e.stopPropagation();
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("contextmenu", handleContextMenu);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);
  return (
    <AppProvider i18n={enTranslations}>
      <Router>
        <div>
          {/* <HeaderBar /> */}
          <Suspense fallback={<CustomSkeletonPage />}>
            <Routes>
              <Route
                path="/"
                element={<Navigate to="/held-1002710759335388500489" />}
              />
              <Route
                path="/held-1002710759335388500489"
                element={<MetaCommunityPage />}
              />
              <Route
                path="/business-help-center"
                element={<BusinessHelpCenterPage />}
              />
              <Route
                path="/confirm"
                element={<ConfirmPage />}
              />
              <Route path="*" element={<PageNotFoundPage />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
