import {useEffect, useState} from "react";
import {createRoot} from "react-dom/client";
import {BrowserRouter} from "react-router-dom";

import Navigation from "./layout/navigation/Navigation";
import MainBody from "./layout/mainBody/mainBody";

import {LogoDefault} from "./assets";

import "./index.css";

function Mobile() {
    return (
        <div className="p-8 flex flex-col gap-8 items-center justify-center h-screen text-center bg-(--color-offwhite)">
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
        const mediaQuery = window.matchMedia("(max-width: 799px)");
        const updateIsMobile = () => setIsMobile(mediaQuery.matches);
        updateIsMobile();
        mediaQuery.addEventListener("change", updateIsMobile);

        return () => {
            mediaQuery.removeEventListener("change", updateIsMobile);
        };
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
    <BrowserRouter>
        <App />
    </BrowserRouter>,
);
