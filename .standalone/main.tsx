import { createRoot } from "react-dom/client";
import Home from "../app/page";
import { DataSources } from "../app/data-sources";
import "../app/globals.css";

createRoot(document.getElementById("root")!).render(<><Home /><DataSources /></>);
