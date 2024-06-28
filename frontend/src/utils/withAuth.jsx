// src/utils/withAuth.js
import { Navigate } from "react-router-dom";
import useAuthCheck from "./hooks/withAuthCheck";

const withAuth = (WrappedComponent) => {
  return function AuthComponent(props) {
    const isAuthenticated = useAuthCheck();

    if (isAuthenticated === null) {
      return <h1 className="text-5xl text-center uppercase font-bold">Loading...</h1>;
    }

    if (isAuthenticated) {
      return <WrappedComponent {...props} />;
    } else {
      return <Navigate to="/account" />;
    }
  };
};

export default withAuth;
