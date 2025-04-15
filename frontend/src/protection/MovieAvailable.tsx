import { Navigate, useLoaderData } from "react-router-dom";

const MovieAvailable = ({ children }: props) => {
  const validMovie = useLoaderData();
  if (!validMovie) return <Navigate to={"/notfound"} />;
  return children;
};

interface props {
  children: React.ReactNode;
}

export default MovieAvailable;
