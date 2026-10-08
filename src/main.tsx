import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { startMotion } from "./motion/motion";
import "./styles/index.css";

startMotion();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
