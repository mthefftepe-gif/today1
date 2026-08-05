import { createRoot } from "react-dom/client";
import Home from "../app/page";
import { DataSources } from "../app/data-sources";
import LiveWeatherRibbon from "../app/live-weather-ribbon";
import "../app/globals.css";
import "../app/live-weather.css";

createRoot(document.getElementById("root")!).render(<><Home /><DataSources /><LiveWeatherRibbon /></>);
