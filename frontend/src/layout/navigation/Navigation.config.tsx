import ParticipantDashboard from "../../pages/ParticipantDashboard/ParticipantDashboard";
import SupportDashboard from "../../pages/SupportDashboard/SupportDashboard";
import Participants from "../../pages/Participants/Participants";

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
import SignatureManagement from "../../pages/SignatureManagement/SignatureManagement";

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
        page: <Participants />,
    },
    {
        name: "Handtekeningen",
        path: "/handtekeningen",
        icon: IconSignature,
        page: <SignatureManagement />,
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

export const navigationItemsIT: INavigationItem[] = [
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
