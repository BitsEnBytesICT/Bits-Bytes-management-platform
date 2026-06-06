import {useState} from "react";
import {NavLink} from "react-router-dom";

import {navigationItemsMenu, navigationItemsBeheer, navigationItemsAccount} from "./navigation.config";

import "./navigation.scss";

import {
    ShapeMobileLeft,
    ShapeMobileRight,
    ShapeDesktopLeft,
    ShapeDesktopRight,
    ButtonMenu,
    LogoWhite,
} from "../../assets";

export default function Navigation() {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <>
            <div className="container_navigation">
                <div
                    className={`container_nav_left ${isOpen ? "open" : ""}`}
                    onMouseEnter={() => setIsOpen(true)}
                    onMouseLeave={() => setIsOpen(false)}>
                    <div className="container_logo">
                        <NavLink to={"/"} className="logo">
                            <img alt="Bits & Bytes" src={LogoWhite} className="image_Logo" />
                        </NavLink>

                        <div className="button_toggle" onClick={() => setIsOpen(prev => !prev)}>
                            <img src={ButtonMenu} className={`icon_Menu ${isOpen ? "rotate" : ""}`} />
                        </div>
                    </div>

                    <div className="container_nav">
                        <nav>
                            <div className="section_Menu">
                                <div className="nav_text">Menu</div>

                                {navigationItemsMenu.map(item => (
                                    <div className="nav_item" key={item.path}>
                                        <img src={item.icon} />

                                        <NavLink
                                            to={item.path}
                                            className={({isActive}) => `route ${isActive ? "active" : ""}`}>
                                            {item.name}
                                        </NavLink>
                                    </div>
                                ))}
                            </div>

                            <div className="section_Beheer">
                                <div className="nav_text">Beheer</div>

                                {navigationItemsBeheer.map(item => (
                                    <div className="nav_item" key={item.path}>
                                        <img src={item.icon} />

                                        <NavLink
                                            to={item.path}
                                            className={({isActive}) => `route ${isActive ? "active" : ""}`}>
                                            {item.name}
                                        </NavLink>
                                    </div>
                                ))}
                            </div>

                            <div className="section_Account">
                                <div className="nav_text">Account</div>

                                {navigationItemsAccount.map(item => (
                                    <div className="nav_item" key={item.path}>
                                        <img src={item.icon} />

                                        <NavLink
                                            to={item.path}
                                            className={({isActive}) => `route ${isActive ? "active" : ""}`}>
                                            {item.name}
                                        </NavLink>
                                    </div>
                                ))}
                            </div>
                        </nav>

                        <img src={ShapeMobileLeft} className="image_shapeLeft" />
                    </div>
                </div>

                <div className={`container_nav_right ${isOpen ? "open" : ""}`}>
                    <div className="container_flex">
                        <img src={ShapeMobileRight} className="image_shapeRight" />

                        <div className="container_space" />
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {/* <div className="fixed flex h-fit flex-row justify-between sm:hidden">
                <div
                    className={`relative top-0 flex h-screen grow-0 gap-0 transition-all duration-400 ${isOpen ? "translate-x-[0vw]" : "translate-x-[-65vw]"}`}>
                    <div className="bg-darkblue w-[70vw]"></div>

                    <button
                        onClick={() => setIsOpen(prev => !prev)}
                        className="absolute top-[3.5%] right-[12.5%] z-20 cursor-pointer">
                        <img
                            src={ButtonMenu}
                            className={`h-fit w-fit transition-transform duration-400 ${isOpen ? "rotate-180" : ""}`}
                        />
                    </button>

                    <img src={ShapeMobileLeft} className="shrink-0 select-none" />
                </div>

                <div
                    className={`relative top-0 -z-10 flex h-screen grow-0 gap-0 transition-all duration-400 ${isOpen ? "translate-x-[-70vw]" : "translate-x-[0vw]"}`}>
                    <img src={ShapeMobileRight} className="shrink-0 select-none" />
                    <div className="bg-orange w-[50rem]" />
                </div>
            </div> */}

            {/* Button Menu - Fixed, not inside containers */}

            {/* Temporary toggle button */}
            {/* <div
                className="absolute top-0 z-15 h-[4rem] w-[4rem] cursor-pointer bg-amber-400"
                onClick={() => setIsOpen(prev => !prev)}>
                {isOpen ? (
                    <span className="absolute top-1/2 left-1/2 text-xl text-white">True</span>
                ) : (
                    <span className="absolute top-1/2 left-1/2 text-xl text-white">False</span>
                )}
            </div> */}

            {/* Desktop Navigation
            <div className="hidden h-screen w-screen flex-row justify-between md:flex">
                <div className="flex h-screen gap-0">
                    <div className="bg-darkblue h-screen w-[10.625rem]" />
                    <img src={ShapeDesktopLeft} className="relative right-[1px] h-screen w-auto select-none" />
                </div>

                <div className="flex h-screen gap-0">
                    <img src={ShapeDesktopRight} className="relative left-[1px] h-screen w-auto select-none" />
                    <div className="bg-orange h-screen w-[10.625rem]" />
                </div>
            </div> */}
        </>
    );
}
