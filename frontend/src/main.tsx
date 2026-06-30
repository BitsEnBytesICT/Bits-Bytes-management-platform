import {StrictMode, useEffect, useState} from "react";
import {createRoot} from "react-dom/client";
import {BrowserRouter} from "react-router-dom";

import Navigation from "./layout/navigation/Navigation";
import MainBody from "./layout/mainBody/mainBody";

import {LogoDefault} from "./assets";

import "./index.css";

function Mobile() {
    return (
        <div className="p-8 flex flex-col items-center justify-center gap-8 h-screen text-center bg-(--color-offwhite)">
            <img
                alt="Bits & Bytes"
                src={LogoDefault}
                className="shrink-0 self-center overflow-y-hidden h-[110px] select-none [-webkit-user-drag:none]"
            />

            <p className="text-[18px] font-medium text-(--color-offblack)">
                Bits & Bytes Management is nog niet geoptimaliseerd voor mobiele apparaten.
            </p>
        </div>
    );
}

function App() {
    const [isOpen, setIsOpen] = useState(false);

    const [isMobile, setIsMobile] = useState(window.innerWidth < 800);

    useEffect(() => {
        const handler = () => setIsMobile(window.innerWidth < 800);
        window.addEventListener("resize", handler);
        return () => window.removeEventListener("resize", handler);
    }, []);

    if (isMobile) return <Mobile />;

    return (
        <>
            <MainBody setIsOpen={setIsOpen} />
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

//small change to test the bump version test5
