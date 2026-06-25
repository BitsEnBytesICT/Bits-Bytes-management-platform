import {useState} from "react";
import {NavLink} from "react-router-dom";

import {navigationItemsMenu, navigationItemsIT, navigationItemsAccount} from "./Navigation.config";

import type {INavigationItem} from "../../types/navigation/INavigation";

import {ShapeLeft, ShapeRight, ButtonMenu, LogoWhite} from "../../assets";

export default function Navigation({isOpen, setIsOpen}) {
    const [versionNumber, setVersionNumber] = useState("0.0.0");

    const navMenuItem = (item: INavigationItem) => (
        <div key={item.path} className="flex items-center gap-2.5 cursor-pointer">
            <img src={item.icon} className="shrink-0 h-fit w-fit select-none [-webkit-user-drag:none]" />

            <NavLink
                to={item.path}
                className={({isActive}) =>
                    `${isActive ? "text-(--color-orange)" : "text-(--color-offwhite)"} hover:text-(--color-orange)
                    transition-colors duration-300 ease`
                }>
                {item.name}
            </NavLink>
        </div>
    );

    return (
        <>
            <div className="flex flex-row fixed top-0 h-fit pointer-events-none">
                <div
                    className={`flex flex-row grow-0 relative top-0 h-screen transition-[left] duration-400
                        ${isOpen ? "left-0" : "-left-62"}`}
                    onMouseEnter={() => setIsOpen(true)}
                    onMouseLeave={() => setIsOpen(false)}
                    style={{pointerEvents: "auto"}}>
                    <div
                        className="flex flex-row gap-16 min-[1000px]:gap-16 [@media(min-height:670px)]:gap-20 absolute
                            top-5 left-6">
                        <img
                            alt="Bits & Bytes"
                            src={LogoWhite}
                            className="shrink-0 self-center overflow-y-hidden h-[80px] min-[1000px]:h-[95px] select-none
                                [-webkit-user-drag:none]"
                        />

                        <div
                            className="mt-6! flex overflow-y-hidden"
                            onClick={() => {
                                setIsOpen(prev => !prev);
                            }}>
                            <img
                                src={ButtonMenu}
                                className={`min-[1000px]:hidden h-[24px] w-[24px] select-none [-webkit-user-drag:none]
                                    transition-transform duration-400 ease-in-out ${isOpen ? "-rotate-45" : ""}`}
                            />

                            <svg
                                className={`hidden self-center min-[1000px]:block
                                    ${isOpen ? "text-(--color-darkblue)" : "text-(--color-offwhite)"} transition-colors
                                    duration-300 ease-in-out`}
                                width="12"
                                height="19"
                                viewBox="0 0 12 19"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M0.864258 17.9028L9.86426 9.51617L0.864258 0.902832"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                />
                            </svg>
                        </div>
                    </div>

                    <div className="flex shrink-0 h-screen">
                        <nav
                            className="pl-6! pt-29.5! min-[1000px]:pr-8! [@media(min-height:740px)]:pt-37.5! flex
                                flex-col gap-6! [@media(min-height:740px)]:gap-12! bg-(--color-darkblue)
                                shadow-[2px_0_0_var(--color-darkblue)]">
                            <div className="flex flex-col gap-3.5">
                                <div
                                    className="block font-medium text-(--color-lightblue) transition-colors duration-300
                                        ease-in-out">
                                    Menu
                                </div>

                                {navigationItemsMenu.map(item => navMenuItem(item))}
                            </div>

                            <div className="flex flex-col gap-3.5">
                                <div
                                    className="block font-medium text-(--color-lightblue) transition-colors duration-300
                                        ease-in-out">
                                    Beheer
                                </div>

                                {navigationItemsIT.map(item => navMenuItem(item))}
                            </div>

                            <div className="flex flex-col gap-3.5">
                                <div
                                    className="block font-medium text-(--color-lightblue) transition-colors duration-300
                                        ease-in-out">
                                    Account
                                </div>

                                {navigationItemsAccount.map(item => navMenuItem(item))}
                            </div>
                        </nav>

                        <img src={ShapeLeft} className="shrink-0 h-auto w-auto select-none [-webkit-user-drag:none]" />
                    </div>
                </div>

                <div
                    className={`shrink-0 fixed -z-10 h-screen transition-[right] duration-400
                        ${isOpen ? "right-0" : "-right-60"}`}>
                    <div className="flex shrink-0 flex-row justify-between h-screen">
                        <img src={ShapeRight} className="shrink-0 h-auto w-auto select-none [-webkit-user-drag:none]" />

                        <div
                            className="flex justify-center w-40 h-screen bg-(--color-orange)
                                shadow-[-2px_0_0_var(--color-orange)]">
                            <div className="mb-6! flex flex-col gap-1 self-end">
                                <div className="text-[14px] text-(--color-lightorange)">
                                    © {new Date().getFullYear()} Bits & Bytes
                                </div>

                                <div className="text-[14px] text-(--color-lightorange)">Management {versionNumber}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
