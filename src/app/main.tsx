import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import "../shared/i18n";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename="/cosmo-boy">
    <App />
  </BrowserRouter>
);
