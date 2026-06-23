import {StrictMode, useEffect, useState} from "react";
import {createRoot} from "react-dom/client";
import {BrowserRouter} from "react-router-dom";

import Navigation from "./layout/navigation/navigation";

import MainBody from "./layout/mainBody/mainBody";

import {LogoDefault} from "./assets";

import "./index.css";

function MobileBlock() {
    return (
        <div className="flex h-screen flex-col items-center justify-center gap-[2rem] bg-(--color-offwhite) p-[2rem] text-center">
            <div className="logo">
                <img
                    alt="Bits & Bytes"
                    src={LogoDefault}
                    className="h-[110px] shrink-0 self-center overflow-y-hidden select-none [-webkit-user-drag:none]"
                />
            </div>

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

    if (isMobile) return <MobileBlock />;

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
