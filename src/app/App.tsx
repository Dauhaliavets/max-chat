import { useState } from "react";
import { RouterProvider } from "react-router/dom";
import { router } from "./router/router";
import type { ICredentials } from "../shared/types";
import { AppContext } from "./contexts/appContext/appContext";
import { STORAGE_KEY } from "./constants";

export const App = () => {
  const [credentials, setCredentials] = useState<ICredentials | null>(() => {
    const credentialsFromStorage = localStorage.getItem(STORAGE_KEY);

    if (!credentialsFromStorage) {
      return null;
    }

    try {
      return JSON.parse(credentialsFromStorage) as ICredentials;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  });

  return (
    <AppContext value={{ credentials, setCredentials }}>
      <RouterProvider router={router} />
    </AppContext>
  );
};
