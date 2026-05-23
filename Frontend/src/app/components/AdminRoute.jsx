import { Navigate } from "react-router-dom";

import { useAppContext } from "@/app/context/AppContext";

const AdminRoute = ({ children }) => {

  const { currentUser, authLoading } = useAppContext();

  // Wait until auth check finishes

  if (authLoading) {

    return <div>Loading...</div>;

  }

  // If no user OR not admin

  if (!currentUser || currentUser.role !== "admin") {

    return <Navigate to="/" replace />;

  }

  return children;

};

export default AdminRoute;