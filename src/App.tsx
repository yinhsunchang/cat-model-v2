import { HelmetProvider } from "react-helmet-async";
import AppRoutes from "./routes/AppRoutes.tsx";
import "./App.css";

function App() {
  return (
    <>
      <HelmetProvider>
        <AppRoutes />
      </HelmetProvider>
    </>
  );
}

export default App;
