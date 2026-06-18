import {useState} from "react";
import {NavLink} from "react-router-dom";

import {navigationItemsMenu, navigationItemsBeheer, navigationItemsAccount} from "./navigation.config";

import {ShapeLeft, ShapeRight, ButtonMenu, LogoWhite} from "../../assets";
import type {NavigationItem} from "../../types/navigation/navigation";

export default function Navigation({isOpen, setIsOpen}) {
    const [versionNumber, setVersionNumber] = useState("0.0.0"); // get the version number through .env?

    const navMenuItem = (item: NavigationItem) => (
        <>
            <div className="flex cursor-pointer items-center gap-[0.625rem]" key={item.path}>
                <img src={item.icon} className="h-fit w-fit shrink-0 select-none [-webkit-user-drag:none]" />

                <NavLink
                    to={item.path}
                    className={({isActive}) =>
                        `${isActive ? "text-(--color-orange)" : "text-(--color-offwhite)"} ease transition-colors duration-300 hover:text-(--color-orange)`
                    }>
                    {item.name}
                </NavLink>
            </div>
        </>
    );

    return (
        <>
            <div className="fixed flex h-fit flex-row pointer-events-none">
                <div
                    className={`relative top-0 flex h-[100vh] grow-0 flex-row transition-[left] duration-400 ${isOpen ? "left-0" : "left-[-15.5rem]"}`}
                    onMouseEnter={() => setIsOpen(true)}
                    onMouseLeave={() => setIsOpen(false)}
                    style={{ pointerEvents: "auto" }}>
                    <div className="absolute top-[1.25rem] left-[1.5rem] flex flex-row gap-[4rem] min-[1000px]:gap-[4rem] [@media(min-height:670px)]:gap-[5rem]">
                        <div className="logo">
                            <img
                                alt="Bits & Bytes"
                                src={LogoWhite}
                                className="h-[80px] shrink-0 self-center overflow-y-hidden select-none [-webkit-user-drag:none] min-[1000px]:h-[95px]"
                            />
                        </div>

                        <div
                            className="!mt-[1.5rem] flex overflow-y-hidden"
                            onClick={() => {
                                console.log("fhdkjd");
                                setIsOpen(prev => !prev);
                            }}>
                            <img
                                src={ButtonMenu}
                                className={`h-[24px] w-[24px] transition-transform duration-400 ease-in-out select-none [-webkit-user-drag:none] min-[1000px]:hidden ${isOpen ? "-rotate-45" : ""}`}
                            />

                            <svg
                                className={`hidden self-center transition-colors duration-300 ease-in-out ${isOpen ? "text-(--color-darkblue)" : "text-(--color-offwhite)"} min-[1000px]:block`}
                                width="12"
                                height="19"
                                viewBox="0 0 12 19"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M0.864258 17.9028L9.86426 9.51617L0.864258 0.902832"
                                    stroke="currentColor"
                                    stroke-width="2.5"
                                />
                            </svg>
                        </div>
                    </div>

                    <div className="flex h-[100vh] shrink-0">
                        <nav className="![@media(min-height:740px)]:pt-[9.375rem] ![@media(min-height:740px)]:gap-[3rem] !min-[1000px]:pr-[2rem] flex flex-col !gap-[1.5rem] bg-(--color-darkblue) !pt-[7.375rem] !pl-[1.5rem] shadow-[2px_0_0_var(--color-darkblue)]">
                            <div className="flex flex-col gap-[0.85rem]">
                                <div className="block font-[500] text-(--color-lightblue) transition-colors duration-300 ease-in-out">
                                    Menu
                                </div>

                                {navigationItemsMenu.map(item => navMenuItem(item))}
                            </div>

                            <div className="flex flex-col gap-[0.85rem]">
                                <div className="block font-[500] text-(--color-lightblue) transition-colors duration-300 ease-in-out">
                                    Beheer
                                </div>

                                {navigationItemsBeheer.map(item => navMenuItem(item))}
                            </div>

                            <div className="flex flex-col gap-[0.85rem]">
                                <div className="block font-[500] text-(--color-lightblue) transition-colors duration-300 ease-in-out">
                                    Account
                                </div>

                                {navigationItemsAccount.map(item => navMenuItem(item))}
                            </div>
                        </nav>

                        <img src={ShapeLeft} className="h-auto w-auto shrink-0 select-none [-webkit-user-drag:none]" />
                    </div>
                </div>

                <div
                    className={`fixed -z-10 h-[100vh] shrink-0 transition-[right] duration-400 ${isOpen ? "right-0" : "right-[-15rem]"}`}>
                    <div className="flex h-[100vh] shrink-0 flex-row justify-between">
                        <img src={ShapeRight} className="h-auto w-auto shrink-0 select-none [-webkit-user-drag:none]" />

                        <div className="flex h-[100vh] w-[10rem] justify-center bg-(--color-orange) shadow-[-2px_0_0_var(--color-orange)]">
                            <div className="!mb-[1.5rem] flex flex-col gap-[0.25rem] self-end">
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
