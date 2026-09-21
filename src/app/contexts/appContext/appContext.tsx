import { createContext, useContext } from "react";
import type { ICredentials } from "../../../shared/types";

const AppContext = createContext<{
  credentials: ICredentials | null;
  setCredentials: React.Dispatch<React.SetStateAction<ICredentials | null>>;
} | null>(null);

const useAppContext = () => {
  const ctx = useContext(AppContext);

  if (!ctx) {
    throw new Error("useAppContext must be used within AppProvider");
  }

  return ctx;
};

export { AppContext, useAppContext };
