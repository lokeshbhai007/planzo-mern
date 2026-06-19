import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return <div className="p-10 text-center">Loading...</div>;
  if (!isSignedIn) return <Navigate to="/" />;

  return children;
}

export default ProtectedRoute;