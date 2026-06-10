import {StrictMode, useState} from "react";

import {createRoot} from "react-dom/client";
import {BrowserRouter} from "react-router-dom";

import Navigation from "./layout/navigation/navigation";

import "./index.css";
import MainBody from "./layout/mainBody/mainBody";

function App() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <MainBody isOpen={isOpen} setIsOpen={setIsOpen} />
            <Navigation isOpen={isOpen} setIsOpen={setIsOpen} />
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
