import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import AdminContextProvider from "./context/AdminContext.jsx";
import BarberContextProvider from "./context/BarberContext.jsx";
import AppContextProvider from "./context/AppContext.jsx";

import { SocketContextProvider } from "./context/SocketContext.jsx"; // Socket Context Provider import kiya

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AdminContextProvider>
      <BarberContextProvider>
        <AppContextProvider>
          <SocketContextProvider>
            <App />
          </SocketContextProvider>
        </AppContextProvider>
      </BarberContextProvider>
    </AdminContextProvider>
  </BrowserRouter>
);
