import {Routes, Route, useLocation, useNavigate} from "react-router-dom";

import {navigationItemsMenu, navigationItemsIT, navigationItemsAccount} from "../navigation/Navigation.config";
import Login from "../../pages/Login/Login";
import {useEffect, useState} from "react";
import {PermissionsList} from "../../types/accounts/accountTypes";
import http from "../../common/http";
import type IAccount from "../../types/accounts/IAccount";

export default function MainBody({setIsOpen}) {
    const [currentAccountType, setCurrentAccountType] = useState<PermissionsList>();
    const routes = navigationItemsMenu.concat(navigationItemsIT).concat(navigationItemsAccount);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const isVerified = async () => {
            if ((await http("/api/verify", "POST")).status !== 200) {
                navigate("/login");
                return;
            } else {
                const account: IAccount = await (await http("/api/account/current", "GET")).json();
                setCurrentAccountType(account.type);
            }
        };

        isVerified();
    }, []);

    return (
        <div
            key={location.pathname}
            onClick={() => setIsOpen(false)}
            className={`mx-auto w-[80vw] max-w-350 z-0 animate-[fade-in_0.3s_ease-in-out] transition-all duration-400 ${
                location.pathname === "/login" ? "h-screen overflow-hidden" : "my-20"
            }`}>
            <Routes>
                {routes.map(route => {
                    if (route.path === "/") {
                        if (currentAccountType === PermissionsList.support) {
                            return <Route path={route.path} element={route.page[0]} />;
                        }

                        if (currentAccountType === PermissionsList.participant) {
                            return <Route path={route.path} element={route.page[1]} />;
                        }

                        return null;
                    }

                    if (currentAccountType) return <Route path={route.path} element={route.page} />;
                })}
                <Route path="/login" element={<Login setCurrentAccountType={setCurrentAccountType} />} />
            </Routes>
        </div>
    );
}
