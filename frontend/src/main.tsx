import {StrictMode, useState} from "react";

import {createRoot} from "react-dom/client";
import {BrowserRouter} from "react-router-dom";

<<<<<<< HEAD
// import MainBody from "./layout/mainBody/mainBody";
=======
>>>>>>> de66e41a6e0b2a0376da269a59511afcf76210f5
import Navigation from "./layout/navigation/navigation";

import "./index.css";

function App() {
<<<<<<< HEAD
    // const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Navigation />
            {/* <Navigation isOpen={isOpen} setIsOpen={setIsOpen} /> */}
            {/* <MainBody isOpen={isOpen} setIsOpen={setIsOpen} /> */}
=======
    return (
        <>
            <Navigation />
>>>>>>> de66e41a6e0b2a0376da269a59511afcf76210f5
        </>
    );
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>,
);
