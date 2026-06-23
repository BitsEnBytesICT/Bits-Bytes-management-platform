import ParticipantDashboard from "../../pages/ParticipantDashboard/ParticipantDashboard";
import SupportDashboard from "../../pages/SupportDashboard/SupportDashboard";

import type {INavigationItem} from "../../types/navigation/INavigation";

import {
    IconDashboard,
    IconParticipant,
    IconSignature,
    IconInventory,
    IconKnowledgeBase,
    IconVMs,
    IconVPNs,
    IconSettings,
    IconLogout,
} from "../../assets";

export const navigationItemsMenu: INavigationItem[] = [
    {
        name: "Dashboard",
        path: "/",
        icon: IconDashboard,
        page: [<SupportDashboard />, <ParticipantDashboard />],
    },
    {
        name: "Deelnemers",
        path: "/deelnemers",
        icon: IconParticipant,
    },
    {
        name: "Handtekeningen",
        path: "/handtekeningen",
        icon: IconSignature,
    },
    {
        name: "Inventarisatie",
        path: "/inventarisatie",
        icon: IconInventory,
    },
    {
        name: "Kennisbank",
        path: "/kennisbank",
        icon: IconKnowledgeBase,
    },
    {
        name: "Servers",
        path: "/servers",
        icon: IconVMs,
    },
];

export const navigationItemsAdmin: INavigationItem[] = [
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
