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
import type {NavigationItem} from "../../types/navigation/navigation";

export const navigationItemsMenu: NavigationItem[] = [
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

<<<<<<< HEAD
export const navigationItemsBeheer = [
=======
export const navigationItemsBeheer: NavigationItem[] = [
>>>>>>> de66e41a6e0b2a0376da269a59511afcf76210f5
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

<<<<<<< HEAD
export const navigationItemsAccount = [
=======
export const navigationItemsAccount: NavigationItem[] = [
>>>>>>> de66e41a6e0b2a0376da269a59511afcf76210f5
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
