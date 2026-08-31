import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

// Lazy-loaded role dashboards
import { lazy, Suspense } from "react";

const CoEDashboard      = lazy(() => import("@/apps/coe/CoEDashboard"));
const HODDashboard      = lazy(() => import("@/apps/hod/HODDashboard"));
const SetterWorkspace   = lazy(() => import("@/apps/setter/SetterWorkspace"));
const EvaluatorDashboard = lazy(() => import("@/apps/evaluator/EvaluatorDashboard"));
const ScrutinizerDashboard = lazy(() => import("@/apps/scrutinizer/ScrutinizerDashboard"));
const ProctorConsole    = lazy(() => import("@/apps/proctor/ProctorConsole"));
const StudentPortal     = lazy(() => import("@/apps/student/StudentPortal"));
const LoginPage         = lazy(() => import("@/apps/auth/LoginPage"));

// Role → Dashboard component map
const ROLE_ROUTES: Record<string, string> = {
  CHIEF_SUPERINTENDENT: "/coe",
  HOD: "/hod",
  PAPER_SETTER: "/setter",
  EVALUATOR: "/evaluator",
  SCRUTINIZER: "/scrutinizer",
  INVIGILATOR: "/proctor",
  STUDENT: "/student",
};

function RoleGuard({ allowedRoles, children }: { allowedRoles: string[]; children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  // Super-admin CHIEF_SUPERINTENDENT has access to oversee all operational modules
  if (user?.role === "CHIEF_SUPERINTENDENT" || allowedRoles.includes(user?.role ?? "")) {
    return <>{children}</>;
  }
  return <Navigate to="/unauthorized" replace />;
}

function UnauthorizedPage() {
  const { user, logout } = useAuthStore();

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--color-bg-base)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      fontFamily: "var(--font-sans)",
    }}>
      <div style={{
        background: "white",
        borderRadius: "20px",
        padding: "40px",
        maxWidth: "520px",
        width: "100%",
        textAlign: "center",
        boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
        border: "1.5px solid var(--color-border)",
      }}>
        <div style={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "#fee2e2",
          color: "#dc2626",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px auto",
          fontSize: "1.8rem",
          fontWeight: 800,
        }}>
          🛡️
        </div>

        <h1 style={{ margin: "0 0 8px 0", fontSize: "1.6rem", fontWeight: 800, color: "#0f172a" }}>
          403 – Role Restricted Area
        </h1>

        <p style={{ margin: "0 0 18px 0", color: "#64748b", fontSize: "0.88rem", lineHeight: 1.5 }}>
          Your current account is authenticated as:
        </p>

        <div style={{ background: "#f8fafc", padding: "12px 16px", borderRadius: "10px", border: "1px solid #e2e8f0", marginBottom: "24px", textAlign: "left", fontSize: "0.82rem" }}>
          <div>User: <strong>{user?.full_name || "Authenticated User"}</strong></div>
          <div style={{ marginTop: "4px" }}>Role: <strong style={{ color: "#2563eb" }}>{user?.role || "UNKNOWN"}</strong></div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <a
            href={user ? (ROLE_ROUTES[user.role] ?? "/") : "/login"}
            style={{
              padding: "12px 20px",
              background: "linear-gradient(135deg, #48977f 0%, #2f6852 100%)",
              color: "white",
              borderRadius: "8px",
              fontWeight: 800,
              fontSize: "0.85rem",
              textDecoration: "none",
              display: "block",
              boxShadow: "0 4px 12px rgba(72,151,127,0.3)",
            }}
          >
            Go to My Dashboard ({user?.role ? ROLE_ROUTES[user.role] : "/login"}) →
          </a>

          <button
            onClick={logout}
            style={{
              padding: "10px 20px",
              background: "white",
              border: "1.5px solid #cbd5e1",
              color: "#475569",
              borderRadius: "8px",
              fontWeight: 700,
              fontSize: "0.82rem",
              cursor: "pointer",
            }}
          >
            Log Out & Switch User Account
          </button>
        </div>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      height: "100vh", background: "var(--color-bg-base)",
    }}>
      <div className="animate-spin" style={{
        width: 40, height: 40, borderRadius: "50%",
        border: "3px solid var(--color-bg-overlay)",
        borderTop: "3px solid var(--color-accent-primary)",
      }} />
    </div>
  );
}

export default function App() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />

          {/* Auto-redirect root to correct dashboard */}
          <Route
            path="/"
            element={
              isAuthenticated && user
                ? <Navigate to={ROLE_ROUTES[user.role] ?? "/login"} replace />
                : <Navigate to="/login" replace />
            }
          />

          {/* Role-isolated dashboards */}
          <Route path="/coe/*" element={
            <RoleGuard allowedRoles={["CHIEF_SUPERINTENDENT"]}><CoEDashboard /></RoleGuard>
          } />
          <Route path="/hod/*" element={
            <RoleGuard allowedRoles={["HOD"]}><HODDashboard /></RoleGuard>
          } />
          <Route path="/setter/*" element={
            <RoleGuard allowedRoles={["PAPER_SETTER"]}><SetterWorkspace /></RoleGuard>
          } />
          <Route path="/evaluator/*" element={
            <RoleGuard allowedRoles={["EVALUATOR"]}><EvaluatorDashboard /></RoleGuard>
          } />
          <Route path="/scrutinizer/*" element={
            <RoleGuard allowedRoles={["SCRUTINIZER"]}><ScrutinizerDashboard /></RoleGuard>
          } />
          <Route path="/proctor/*" element={
            <RoleGuard allowedRoles={["INVIGILATOR","CHIEF_SUPERINTENDENT"]}><ProctorConsole /></RoleGuard>
          } />
          <Route path="/student/*" element={
            <RoleGuard allowedRoles={["STUDENT"]}><StudentPortal /></RoleGuard>
          } />

          {/* Fallback */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
