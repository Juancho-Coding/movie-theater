import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import MainMovies from "./pages/MainMovies";
import MainTheme from "./themes/MainTheme";

const router = createBrowserRouter([
  // main page, shows the content visible to public
  { path: "", element: <MainMovies /> },
  // logn page, for admin only
  { path: "/login", element: <>hello world</> },
  // admin page, allow changes and visualization of info
  { path: "/admin", element: <>hello world</> },
]);

function App() {
  return (
    <MainTheme>
      <RouterProvider router={router}></RouterProvider>
    </MainTheme>
  );
}

export default App;
