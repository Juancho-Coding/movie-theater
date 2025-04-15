import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import MainMovies from "./pages/MainMovies";
import MainTheme from "./themes/MainTheme";
import MovieReservation from "./pages/MovieReservation";
import AuthContextProvider from "./context/AuthContextProvider";
import { Toaster } from "react-hot-toast";
import { movieValidation } from "./loaders/MovieLoader";
import MovieAvailable from "./protection/MovieAvailable";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./pages/404";

const router = createBrowserRouter([
  // main page, shows the content visible to public
  { path: "/", element: <MainMovies />, errorElement: <ErrorBoundary /> },
  {
    path: "/reservation/:movieId/:timeId/:date",
    element: (
      <MovieAvailable>
        <MovieReservation />
      </MovieAvailable>
    ),
    loader: movieValidation,
    errorElement: <ErrorBoundary />,
  },
  { path: "/notfound", element: <NotFound /> },
  // logn page, for admin only pending to implement
  { path: "/login", element: <>hello world</> },
  // admin page, allow changes and visualization of info, pending to implement
  { path: "/admin", element: <>hello world</> },
]);

function App() {
  return (
    <MainTheme>
      <Toaster position="top-center" />
      <AuthContextProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <RouterProvider router={router}></RouterProvider>
        </LocalizationProvider>
      </AuthContextProvider>
    </MainTheme>
  );
}

export default App;
