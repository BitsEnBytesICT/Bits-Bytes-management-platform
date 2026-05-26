import "./navbar.css";
import {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleArrowRight} from "@fortawesome/free-solid-svg-icons/faCircleArrowRight";
import {faCircleArrowLeft} from "@fortawesome/free-solid-svg-icons/faCircleArrowLeft";

export default function Navbar({isOpen, setIsOpen}) {
    const [zIndex, setzIndex] = useState("z-0");

    const onToggleNavbarClick = () => {
        setIsOpen(!isOpen);
        setzIndex("z-10");
    };

    const handlezIndex = (e: React.TransitionEvent<HTMLDivElement>, property: string) => {
        if (!isOpen && e.propertyName === property) setzIndex("z-0");
    };

    return (
        <>
            <div
                onTransitionEnd={e => handlezIndex(e, "left")}
                className={`left-slider fixed top-0 flex flex-col gap-y-[30px] transition-all duration-400 ${zIndex} ${isOpen ? "-left-[150px]" : "-left-[280px]"}`}>
                <button className="navbar-content mt-[50px] mr-[20px] self-end" onClick={onToggleNavbarClick}>
                    {isOpen ? (
                        <FontAwesomeIcon size="2x" icon={faCircleArrowLeft} />
                    ) : (
                        <FontAwesomeIcon size="2x" icon={faCircleArrowRight} />
                    )}
                </button>
                <span
                    className={`navbar-content mr-[20px] self-end transition-all duration-400 ${!isOpen ? "pointer-events-none opacity-0" : "opacity-100"}`}>
                    item 1
                </span>
                <span
                    className={`navbar-content mr-[20px] self-end transition-all duration-400 ${!isOpen ? "pointer-events-none opacity-0" : "opacity-100"}`}>
                    item 2
                </span>
                <span
                    className={`navbar-content mr-[20px] self-end transition-all duration-400 ${!isOpen ? "pointer-events-none opacity-0" : "opacity-100"}`}>
                    item 3
                </span>
            </div>
            <div
                onTransitionEnd={e => handlezIndex(e, "right")}
                className={`right-slider fixed bottom-0 flex flex-col-reverse gap-y-[30px] transition-all duration-400 ${zIndex} ${isOpen ? "-right-[190px] z-1" : "-right-[320px]"}`}>
                <button className="navbar-content mb-[50px] ml-[20px] self-start" onClick={onToggleNavbarClick}>
                    {isOpen ? (
                        <FontAwesomeIcon size="2x" icon={faCircleArrowLeft} />
                    ) : (
                        <FontAwesomeIcon size="2x" icon={faCircleArrowRight} />
                    )}
                </button>
                <span
                    className={`navbar-content ml-[20px] self-start transition-all duration-400 ${!isOpen ? "pointer-events-none opacity-0" : "opacity-100"}`}>
                    item 1
                </span>
                <span
                    className={`navbar-content ml-[20px] self-start transition-all duration-400 ${!isOpen ? "pointer-events-none opacity-0" : "opacity-100"}`}>
                    item 2
                </span>
                <span
                    className={`navbar-content ml-[20px] self-start transition-all duration-400 ${!isOpen ? "pointer-events-none opacity-0" : "opacity-100"}`}>
                    item 3
                </span>
            </div>
        </>
    );
}
