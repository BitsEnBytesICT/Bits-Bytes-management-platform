import "./mainBody.css";
import {BrowserRouter, Routes, Route, Link} from "react-router-dom";

export default function MainBody({isOpen, setIsOpen}) {
    return (
        <div
            onClick={() => setIsOpen(false)}
            className={`absolute top-1/2 left-1/2 z-0 h-[85vh] w-[75vw] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-[#bcd8ec] transition-all duration-400 ${isOpen ? "blur-[4px]" : ""}`}>
            <BrowserRouter>
                {/* Navigation */}
                {/* <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </nav> */}
                {/*<Routes>*/}
                {/*    <Route path="/" element={<MainBody />} />*/}
                {/*</Routes>*/}
            </BrowserRouter>
        </div>
    );
}
