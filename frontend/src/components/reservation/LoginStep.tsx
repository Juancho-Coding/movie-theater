import { useContext, useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import authContext from "../../context/AuthContext";
import toast from "react-hot-toast";
import { makeSignup } from "../../api/authApi";

const LoginStep = ({ nextStep }: props) => {
  const [login, setLogin] = useState(true);
  const context = useContext(authContext);

  /**
   * Try to make login with the user info
   * @param email
   * @param password
   */
  const loginHandler = async (email: string, password: string) => {
    const loginResult = await context.login(email, password, false);
    if (loginResult.result === true) {
      nextStep();
      return toast.success(loginResult.message);
    }
    toast.error(loginResult.message);
  };

  /**
   * Make a dummy login with no information for demostration purposes
   */
  const dummyLoginHandler = async () => {
    const loginResult = await context.login("dummy@dummy.com", "123456", true);
    if (loginResult.result === true) {
      nextStep();
      return toast.success(loginResult.message);
    }
    toast.error(loginResult.message);
  };

  /**
   * Try to make signup with the new user information
   * @param name
   * @param email
   * @param password
   */
  const signupHandler = async (
    name: string,
    email: string,
    password: string
  ) => {
    try {
      const signingResult = await makeSignup(name, email, password);
      if (signingResult.status) {
        toast.success(signingResult.message);
        setLogin(true);
      } else {
        toast.error(signingResult.message);
      }
    } catch (error) {
      const resultError = error as Error;
      toast.error(resultError.message);
    }
  };

  return (
    <>
      {login && (
        <LoginForm
          login={loginHandler}
          dummyLogin={dummyLoginHandler}
          dismiss={setLogin}
        />
      )}
      {!login && <SignupForm signup={signupHandler} dismiss={setLogin} />}
    </>
  );
};

interface props {
  nextStep: () => void;
}

export default LoginStep;
