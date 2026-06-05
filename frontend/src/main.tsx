import {StrictMode, useState} from "react";

import {createRoot} from "react-dom/client";
import {BrowserRouter} from "react-router-dom";

import MainBody from "./layout/navbar/navbar";
import Navbar from "./layout/navbar/navbar";

import "./index.css";

function App() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
            <MainBody isOpen={isOpen} setIsOpen={setIsOpen} />
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
