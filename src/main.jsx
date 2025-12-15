import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import './index.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import 'primereact/resources/themes/lara-light-blue/theme.css'; 
import 'primereact/resources/primereact.min.css';               
import 'primeicons/primeicons.css';      
ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
