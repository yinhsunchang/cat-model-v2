import { HelmetProvider } from "react-helmet-async";
import CatModel from "./CatModel.tsx";

function App() {
  return (
    <>
      <HelmetProvider>
        <CatModel />
      </HelmetProvider>
    </>
  );
}

export default App;
