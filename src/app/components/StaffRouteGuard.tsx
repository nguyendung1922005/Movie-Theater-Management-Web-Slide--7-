import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { StaffRole } from "./StaffLayout";
import { getUserRole, getCurrentUser } from "../../lib/auth";

export function StaffRouteGuard({
  allow,
  children,
}: {
  allow: StaffRole[];
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      const user = await getCurrentUser();
      
      if (!user) {
        // Not authenticated, redirect to auth
        navigate("/auth", { replace: true });
        return;
      }

      const role = await getUserRole(user.id);
      
      if (!role) {
        // No role found in database, redirect to home
        navigate("/", { replace: true });
        return;
      }

      // Check if user is a customer
      if (role === "customer") {
        navigate("/", { replace: true });
        return;
      }

      // Check if role is allowed for this route
      const isSuperUser = role === "STAFF" || role === "ADMIN";
      if (!allow.includes(role as StaffRole) && !isSuperUser) {
        navigate("/staff/shift", { replace: true });
        return;
      }

      setChecked(true);
    };

    checkRole();
  }, [allow, navigate]);

  if (!checked) return null;
  return <>{children}</>;
}
