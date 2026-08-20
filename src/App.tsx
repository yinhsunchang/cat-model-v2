import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./auth/AuthProvider";
import AppRoutes from "./routes/AppRoutes.tsx";
import "./App.css";

function App() {
  return (
    <>
      <HelmetProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </HelmetProvider>
    </>
  );
}

export default App;
