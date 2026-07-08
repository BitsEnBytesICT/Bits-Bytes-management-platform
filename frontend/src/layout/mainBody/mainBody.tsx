import {Routes, Route, useLocation} from "react-router-dom";

import {navigationItemsMenu, navigationItemsIT, navigationItemsAccount} from "../navigation/Navigation.config";
import Login from "../../pages/Login/Login";

export default function MainBody({setIsOpen}) {
    const routes = navigationItemsMenu.concat(navigationItemsIT).concat(navigationItemsAccount);
    const location = useLocation();

    const currentAccountType: string = "support"; // dit is als test totdat we een login hebben!

    return (
        <div
            key={location.pathname}
            onClick={() => setIsOpen(false)}
            className={`mx-auto w-[80vw] max-w-350 z-0 animate-[fade-in_0.3s_ease-in-out] transition-all duration-400 ${
                location.pathname === "/login" ? "h-screen overflow-hidden" : "my-20"
            }`}>
            <Routes>
                {routes.map(route => {
                    if (route.path === "/" && currentAccountType === "support") {
                        return <Route path={route.path} element={route.page[0]} />;
                    } else if (route.path === "/" && currentAccountType === "participant") {
                        return <Route path={route.path} element={route.page[1]} />;
                    } else return <Route path={route.path} element={route.page} />;
                })}
                <Route path="/login" element={<Login />} />
            </Routes>
        </div>
    );
}
