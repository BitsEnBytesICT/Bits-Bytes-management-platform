import {useState} from "react";
import {NavLink} from "react-router-dom";

import {navigationItemsMenu, navigationItemsBeheer, navigationItemsAccount} from "./navigation.config";

import "./navigation.scss";

import {ShapeLeft, ShapeRight, ButtonMenu, LogoWhite} from "../../assets";

export default function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
    const [versionNumber, setVersionNumber] = useState("0.0.0"); // get the version number through .env?

    return (
        <>
            <div className="container_navigation">
                <div
                    className={`container_nav_left ${isOpen ? "open" : ""}`}
                    onMouseEnter={() => setIsOpen(true)}
                    onMouseLeave={() => setIsOpen(false)}>
                    <div className="container_logo">
                        <div className="logo">
                            <img alt="Bits & Bytes" src={LogoWhite} className="image_Logo" />
                        </div>

                        <div className="button_toggle" onClick={() => setIsOpen(prev => !prev)}>
                            <img src={ButtonMenu} className={`icon_Menu ${isOpen ? "rotate" : ""}`} />

                            <svg
                                className={`icon_Arrow ${isOpen ? "disappear" : ""}`}
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

                    <div className="container_nav">
                        <nav>
                            <div className="section_Menu">
                                <div className="section_text">Menu</div>

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
                                <div className="section_text">Beheer</div>

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
                                <div className="section_text">Account</div>

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

                        <img src={ShapeLeft} className="image_ShapeLeft" />
                    </div>
                </div>

                <div className={`container_nav_right ${isOpen ? "open" : ""}`}>
                    <div className="container_flex">
                        <img src={ShapeRight} className="image_ShapeRight" />

                        <div className="container_space">
                            <div className="container_info">
                                <div className="copyright_text">© {new Date().getFullYear()} Bits & Bytes</div>

                                <div className="version_text">Management {versionNumber}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
