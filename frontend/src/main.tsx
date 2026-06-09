import {StrictMode, useState} from "react";

import {createRoot} from "react-dom/client";
import {BrowserRouter} from "react-router-dom";

import Navigation from "./layout/navigation/navigation";

import "./index.css";

function App() {
    return (
        <>
            <Navigation />
        </>
    );
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>,
);
