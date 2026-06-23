import {Routes, Route} from "react-router-dom";
import {navigationItemsAccount, navigationItemsAdmin, navigationItemsMenu} from "../navigation/Navigation.config";

export default function MainBody({setIsOpen}) {
    const routes = navigationItemsMenu.concat(navigationItemsAdmin).concat(navigationItemsAccount);

    const currentAccountType: string = "support"; // dit is als test totdat we een login hebben!

    return (
        <div
            onClick={() => setIsOpen(false)}
            className={"mx-auto my-20 w-[80vw] max-w-350 z-0 transition-all duration-400"}>
            <Routes>
                {routes.map(route => {
                    if (route.path === "/" && currentAccountType === "support") {
                        return <Route path={route.path} element={route.page[0]} />;
                    } else if (route.path === "/" && currentAccountType === "participant") {
                        return <Route path={route.path} element={route.page[1]} />;
                    } else return <Route path={route.path} element={route.page} />;
                })}
            </Routes>
        </div>
    );
}
