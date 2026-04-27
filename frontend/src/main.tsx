import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Subject from "./pages/private/Subject.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/app" element={<App />} />
                <Route path="/subject" element={<Subject />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>,
);
