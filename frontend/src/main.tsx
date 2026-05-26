import {StrictMode, useState} from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import MainBody from "./components/layout/mainBody/mainBody";
import Navbar from "./components/layout/navbar/navbar";

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
        <App />
    </StrictMode>,
);
