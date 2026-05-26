import type { JSX } from "react";
import { NavigationLinksRight, NavigationLinksLeft } from "../../../types/navigation/navigation";
import "./mainBody.css";
import {Routes, Route} from "react-router-dom";

export default function MainBody({isOpen, setIsOpen}) {
    const navigationItems = {...NavigationLinksRight, ...NavigationLinksLeft};
    return (
        <div
            onClick={() => setIsOpen(false)}
            className={`absolute top-1/2 left-1/2 z-0 h-[85vh] w-[75vw] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-[#bcd8ec] transition-all duration-400 ${isOpen ? "blur-[4px]" : ""}`}>
                <Routes>
                    {Object.keys(navigationItems).map((key) => <Route path={`/${key.toLowerCase()}`} element={navigationItems[key]()} /> ) }
                </Routes>
        </div>
    );
}
