
import { Navigate } from "react-router-dom";

import { useAppContext } from "@/app/context/AppContext";

export default function RoleRoute({ children, allowedRole }) {

  const { currentUser, authLoading } = useAppContext();

  // Wait until auth is ready

  if (authLoading) {

    return <div>Loading...</div>;

  }

  // Not logged in

  if (!currentUser) {

    return <Navigate to="/login" replace />;

  }

  // Role mismatch

  if (allowedRole && currentUser.role !== allowedRole) {

    return <Navigate to="/" replace />;

  }

  return children;

}
