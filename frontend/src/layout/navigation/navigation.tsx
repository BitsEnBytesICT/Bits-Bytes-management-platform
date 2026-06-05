import {useState} from "react";
import {Link} from "react-router-dom";

// import {NavigationLinksLeft, NavigationLinksRight} from "../../types/navigation/navigation";

import {ShapeMobileLeft, ShapeMobileRight, ShapeDesktopLeft, ShapeDesktopRight} from "../../assets";

export default function Navigation() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Navigation */}
            <div className="fixed flex h-fit flex-row justify-between md:hidden">
                <div
                    className={`relative top-0 flex h-screen flex-grow-0 gap-0 transition-all duration-400 ${isOpen ? "translate-x-[0vw]" : "translate-x-[-60vw]"}`}>
                    <div className="bg-darkblue w-[70vw]" />
                    <img src={ShapeMobileLeft} className="flex-shrink-0 select-none" />
                </div>

                <div
                    className={`relative top-0 -z-10 flex h-screen flex-grow-0 gap-0 transition-all duration-400 ${isOpen ? "translate-x-[-70vw]" : "translate-x-[0vw]"}`}>
                    <img src={ShapeMobileRight} className="flex-shrink-0 select-none" />
                    <div className="bg-orange w-[50rem]" />
                </div>
            </div>

            {/* Temporary toggle button */}
            <div
                className="absolute top-0 z-15 h-[4rem] w-[4rem] cursor-pointer bg-amber-400"
                onClick={() => setIsOpen(prev => !prev)}>
                {isOpen ? (
                    <span className="absolute top-1/2 left-1/2 text-xl text-white">True</span>
                ) : (
                    <span className="absolute top-1/2 left-1/2 text-xl text-white">False</span>
                )}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden h-screen w-screen flex-row justify-between md:flex">
                <div className="flex h-screen gap-0">
                    <div className="bg-darkblue h-screen w-[10.625rem]" />
                    <img src={ShapeDesktopLeft} className="relative right-[1px] h-screen w-auto select-none" />
                </div>

                <div className="flex h-screen gap-0">
                    <img src={ShapeDesktopRight} className="relative left-[1px] h-screen w-auto select-none" />
                    <div className="bg-orange h-screen w-[10.625rem]" />
                </div>
            </div>
        </>
    );
}
