import {Routes, Route} from "react-router-dom";
import {navigationItemsAccount, navigationItemsBeheer, navigationItemsMenu} from "../navigation/navigation.config";

export default function MainBody({isOpen, setIsOpen}) {
    const routes = navigationItemsMenu.concat(navigationItemsBeheer).concat(navigationItemsAccount);

    const currentAccountType: string = "zorg"; //dit is als test totdat we een login hebben!
    return (
        <div
            onClick={() => setIsOpen(false)}
            className={`absolute top-1/2 left-1/2 z-0 h-[95vh] w-[85vw] -translate-x-1/2 -translate-y-1/2 rounded-xl transition-all duration-400`}>
            <Routes>
                {routes.map(route => {
                    if (route.path === "/" && currentAccountType === "zorg") {
                        return <Route path={route.path} element={route.page[0]} />;
                    } else if (route.path === "/" && currentAccountType === "deelnemer") {
                        return <Route path={route.path} element={route.page[1]} />;
                    } else return <Route path={route.path} element={route.page} />;
                })}
            </Routes>
        </div>
    );
}
