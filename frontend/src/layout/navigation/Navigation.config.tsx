import {
    IconDashboard,
    IconDeelnemers,
    IconHandtekeningen,
    IconInventarisatie,
    IconKennisbank,
    IconVMs,
    IconVPNs,
    IconSettings,
    IconLogout,
} from "../../assets";
import DeelnemerDashboard from "../../pages/DeelnemerDashboard/deelnemerDashboard";
import ZorgDashboard from "../../pages/ZorgDashboard/ZorgDashboard";
import type {INavigationItem} from "../../types/navigation/INavigation";

export const navigationItemsMenu: INavigationItem[] = [
    {
        name: "Dashboard",
        path: "/",
        icon: IconDashboard,
        page: [<ZorgDashboard />, <DeelnemerDashboard />],
    },
    {
        name: "Deelnemers",
        path: "/deelnemers",
        icon: IconDeelnemers,
    },
    {
        name: "Handtekeningen",
        path: "/handtekeningen",
        icon: IconHandtekeningen,
    },
    {
        name: "Inventarisatie",
        path: "/inventarisatie",
        icon: IconInventarisatie,
    },
    {
        name: "Kennisbank",
        path: "/kennisbank",
        icon: IconKennisbank,
    },
    {
        name: "Servers",
        path: "/servers",
        icon: IconVMs,
    },
];

export const navigationItemsBeheer: INavigationItem[] = [
    {
        name: "VM's",
        path: "/VMs",
        icon: IconVMs,
    },
    {
        name: "VPN's",
        path: "/VPNs",
        icon: IconVPNs,
    },
];

export const navigationItemsAccount: INavigationItem[] = [
    {
        name: "Instellingen",
        path: "/settings",
        icon: IconSettings,
    },
    {
        name: "Uitloggen",
        path: "/logout",
        icon: IconLogout,
    },
];
