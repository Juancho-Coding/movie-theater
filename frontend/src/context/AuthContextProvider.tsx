import { ReactNode, useState } from "react";
import AuthContext, { userData } from "./AuthContext";
import { makeLogin } from "../api/authApi";

const AUTH_TOKEN = "auth_data";

function getDataFromStaorage() {
  const value = localStorage.getItem(AUTH_TOKEN);
  if (value) return JSON.parse(value) as userData;
  return null;
}

const AuthContextProvider = ({ children }: props) => {
  const [userData, setUserData] = useState<userData>(getDataFromStaorage);

  const login = async (email: string, password: string) => {
    try {
      const logged = await makeLogin(email, password);
      setUserData(logged);
      if (logged !== null) {
        localStorage.setItem(AUTH_TOKEN, JSON.stringify(logged));
        return { result: true, message: "Logged in" };
      }
      return { result: false, message: "User or password invalid" };
    } catch (error) {
      const resultError = error as string;
      return { result: false, message: String(resultError) };
    }
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN);
    setUserData(null);
    return true;
  };

  const contextData = { userData, login, logout };
  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};

interface props {
  children: ReactNode;
}
export default AuthContextProvider;
