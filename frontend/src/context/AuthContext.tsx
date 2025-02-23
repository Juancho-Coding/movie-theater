import { createContext } from "react";

export type userData = {
  name: string;
  email: string;
  level: number;
  token: string;
} | null;

const authContext: {
  userData: userData;
  login: (
    email: string,
    password: string
  ) => Promise<{ result: boolean; message: string }>;
  logout: () => boolean;
} = {
  userData: null,
  login: async (email: string, password: string) =>
    new Promise<{ result: boolean; message: string }>((resolve, reject) =>
      reject()
    ),
  logout: () => false,
};

const context = createContext(authContext);

export default context;
