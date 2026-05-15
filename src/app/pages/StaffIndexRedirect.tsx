import { Navigate } from "react-router-dom";

/** Default landing inside staff portal — shift hub */
export function StaffIndexRedirect() {
  return <Navigate to="/staff/shift" replace />;
}
