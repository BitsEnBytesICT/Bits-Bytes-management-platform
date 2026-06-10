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
import deelnemerDashboard from "../../pages/deelnemerDashboard/deelnemerDashboard";
import zorgDashboard from "../../pages/zorgDashboard/zorgDashboard";
import type {NavigationItem} from "../../types/navigation/navigation";

export const navigationItemsMenu: NavigationItem[] = [
    {
        name: "Dashboard",
        path: "/",
        icon: IconDashboard,
        page: [zorgDashboard(), deelnemerDashboard()],
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

export const navigationItemsBeheer: NavigationItem[] = [
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

export const navigationItemsAccount: NavigationItem[] = [
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
