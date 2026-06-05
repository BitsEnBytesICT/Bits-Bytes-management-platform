import {StrictMode, useState} from "react";

import {createRoot} from "react-dom/client";
import {BrowserRouter} from "react-router-dom";

// import MainBody from "./layout/mainBody/mainBody";
import Navigation from "./layout/navigation/navigation";

import "./index.css";

function App() {
    // const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Navigation />
            {/* <Navigation isOpen={isOpen} setIsOpen={setIsOpen} /> */}
            {/* <MainBody isOpen={isOpen} setIsOpen={setIsOpen} /> */}
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
