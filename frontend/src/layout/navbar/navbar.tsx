import {useState} from "react";

// import {NavigationLinksLeft, NavigationLinksRight} from "../../types/navigation/navigation";

import circleArrowRight from "../../assets/ui/circleArrowRight.png";
import circleArrowLeft from "../../assets/ui/circleArrowLeft.png";

import "./navbar.css";

export default function Navbar({isOpen, setIsOpen}) {
    const [zIndex, setzIndex] = useState("z-0");

    const onToggleNavbarClick = () => {
        setIsOpen(!isOpen);
        setzIndex("z-10");
    };

    const handlezIndex = (e: React.TransitionEvent<HTMLDivElement>, property: string) => {
        if (!isOpen && e.propertyName === property) setzIndex("z-0");
    };

    // const navbarContentLeft = (content: string) => {
    //     return (
    //         <>
    //             <span
    //                 className={`navbar-content mr-[20px] self-end text-white transition-all duration-400 ${!isOpen ? "pointer-events-none opacity-0" : "opacity-100"}`}>
    //                 <Link to={`/${content.toLowerCase()}`}>{content}</Link>
    //             </span>
    //         </>
    //     );
    // };

    // const navbarContentRight = (content: string) => {
    //     return (
    //         <>
    //             <span
    //                 className={`navbar-content ml-[20px] self-start text-white transition-all duration-400 ${!isOpen ? "pointer-events-none opacity-0" : "opacity-100"}`}>
    //                 <Link to={`/${content.toLowerCase()}`}>{content}</Link>
    //             </span>
    //         </>
    //     );
    // };

    return (
        <>
            <div
                onTransitionEnd={e => handlezIndex(e, "left")}
                onMouseEnter={onToggleNavbarClick}
                onMouseLeave={onToggleNavbarClick}
                className={`left-slider fixed top-0 flex flex-col gap-y-[30px] transition-all duration-400 ${zIndex} ${isOpen ? "-left-[150px]" : "-left-[280px]"}`}>
                <button className="navbar-content mt-[50px] mr-[20px] self-end" onClick={onToggleNavbarClick}>
                    {isOpen ? (
                        <img src={circleArrowLeft} width="40px" height="40px"></img>
                    ) : (
                        <img src={circleArrowRight} width="40px" height="40px"></img>
                    )}
                </button>

                {/* {Object.keys(NavigationLinksLeft).map(key => navbarContentLeft(key))} */}
            </div>
            <div
                onMouseEnter={onToggleNavbarClick}
                onMouseLeave={onToggleNavbarClick}
                onTransitionEnd={e => handlezIndex(e, "right")}
                className={`right-slider fixed bottom-0 flex flex-col-reverse gap-y-[30px] transition-all duration-400 ${zIndex} ${isOpen ? "-right-[190px] z-1" : "-right-[320px]"}`}>
                <button className="navbar-content mb-[50px] ml-[20px] self-start" onClick={onToggleNavbarClick}>
                    {isOpen ? (
                        <img src={circleArrowLeft} width="40px" height="40px"></img>
                    ) : (
                        <img src={circleArrowRight} width="40px" height="40px"></img>
                    )}
                </button>
                {/* {Object.keys(NavigationLinksRight).map(key => navbarContentRight(key))} */}
            </div>
        </>
    );
}
