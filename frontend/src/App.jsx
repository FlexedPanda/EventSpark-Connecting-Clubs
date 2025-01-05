import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";

import EventSpark from "./pages/EventSpark.jsx";
import AuthRoutes from "./routes/AuthRoutes.jsx";
import GuestRoutes from "./routes/GuestRoutes.jsx";
import PanelRoutes from "./routes/PanelRoutes.jsx";
import SponsorRoutes from "./routes/SponsorRoutes.jsx";
import OfficerRoutes from "./routes/OfficerRoutes.jsx";
import { useAuth } from "./contexts/AuthContext.jsx";

function App() {
  const roles = {
    Guest: GuestRoutes,
    Panel: PanelRoutes,
    Sponsor: SponsorRoutes,
    Officer: OfficerRoutes,
  };

  const { user, type } = useAuth();
  const RoleRoutes = type && roles[type];
  const path = type && type.toLowerCase();

  return (
    <>
      <Toaster
        toastOptions={{
          style: {
            background: "#27272a",
            color: "#fafafa",
          },
        }}
      />
      <Routes>
        <Route path="/app/home/*" element={!user && <AuthRoutes />} />
        {path && RoleRoutes && (
          <Route path={`/app/${path}/*`} element={<RoleRoutes />} />
        )}
        <Route path="/app" element={!user && <EventSpark />} /> 
        <Route path="/" element={<a href="/app">Frontend APP Running...</a>} />
      </Routes>
    </>
  );
}

export default App;
