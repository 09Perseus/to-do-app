//This file will contain the context for the token useState variable
import type { ReactNode } from "react";
import { useState, createContext, useContext } from "react";

interface TokenContextType {
  token: string;
  setToken: (token: string) => void;
}

const tokenContext = createContext<TokenContextType | undefined>(undefined);

export function TokenProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string>("");
  return (
    <tokenContext.Provider value={{ token, setToken }}>
      {children}
    </tokenContext.Provider>
  );
}

export function useToken(): TokenContextType {
  const context = useContext(tokenContext);
  if (!context) {
    throw new Error("useToken must be used within a TokenProvider");
  }
  return context;
}
