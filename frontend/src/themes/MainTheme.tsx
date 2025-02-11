import { createTheme, ThemeProvider } from "@mui/material";
import { ReactNode } from "react";

const theme = createTheme({
  typography: {
    fontFamily: ["Poppins", "Roboto"].join(","),
  },
  palette: {
    primary: {
      main: "#DB504A",
    },
    secondary: {
      main: "#AFD5AA",
    },
    error: {
      main: "#e90505",
    },
    warning: {
      main: "#ee6719",
    },
    info: {
      main: "#1a9094",
    },
    success: {
      main: "#188814",
    },
  },
});

const MainTheme = ({ children }: props) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

type props = { children?: ReactNode };

export default MainTheme;
