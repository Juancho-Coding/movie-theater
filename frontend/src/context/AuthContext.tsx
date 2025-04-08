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
    password: string,
    dummy: boolean
  ) => Promise<{ result: boolean; message: string }>;
  logout: () => boolean;
} = {
  userData: null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  login: async (_email: string, _password: string, _dummy: boolean) =>
    new Promise<{ result: boolean; message: string }>((_resolve, reject) =>
      reject()
    ),
  logout: () => false,
};

const context = createContext(authContext);

export default context;
