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

export const navigationItemsMenu = [
    {
        name: "Dashboard",
        path: "/",
        icon: IconDashboard,
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

export const navigationItemsBeheer = [
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

export const navigationItemsAccount = [
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
