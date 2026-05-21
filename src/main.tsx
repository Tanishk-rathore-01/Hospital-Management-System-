import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import App from "../App";
import { BrowserRouter } from 'react-router-dom';

// Vite project currently keeps App and styles at repo root; this ensures build passes without moving files yet.

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

