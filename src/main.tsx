import React from "react";
import ReactDOM from "react-dom/client";
import { ConvexReactClient } from "convex/react";
import { BrowserRouter } from "react-router-dom";
import { AuthKitProvider, useAuth } from "@workos-inc/authkit-react";
import { ConvexProviderWithAuthKit } from "@convex-dev/workos";
import App from "./App";
import "./index.css";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

// Storage key for preserving intended route across auth flow
const RETURN_TO_KEY = "opensync_return_to";

// Handle redirect after OAuth callback
// Restores the user to their originally requested route
const onRedirectCallback = () => {
  const returnTo = sessionStorage.getItem(RETURN_TO_KEY) || "/";
  sessionStorage.removeItem(RETURN_TO_KEY);
  
  // Navigate to the intended route (clean URL without OAuth params)
  const cleanUrl = window.location.origin + returnTo;
  window.history.replaceState({}, document.title, cleanUrl);
};

function Root() {
  return (
    <AuthKitProvider
      clientId={import.meta.env.VITE_WORKOS_CLIENT_ID}
      redirectUri={import.meta.env.VITE_REDIRECT_URI || `${window.location.origin}/callback`}
      devMode={import.meta.env.DEV}
      onRedirectCallback={onRedirectCallback}
    >
      <ConvexProviderWithAuthKit client={convex} useAuth={useAuth}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConvexProviderWithAuthKit>
    </AuthKitProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
