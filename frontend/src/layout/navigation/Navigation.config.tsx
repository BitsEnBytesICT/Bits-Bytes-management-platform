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
import {PermissionsList} from "../../types/accounts/accountTypes";

export const navigationItemsMenu: INavigationItem[] = [
    {
        name: "Dashboard",
        path: "/",
        icon: IconDashboard,
        roles: [PermissionsList.superAdmin, PermissionsList.support, PermissionsList.participant, PermissionsList.it],
        page: [<SupportDashboard />, <ParticipantDashboard />],
    },
    {
        name: "Deelnemers",
        path: "/deelnemers",
        icon: IconParticipant,
        roles: [PermissionsList.superAdmin, PermissionsList.support, PermissionsList.it],
        page: <Participants />,
    },
    {
        name: "Handtekeningen",
        path: "/handtekeningen",
        icon: IconSignature,
        roles: [PermissionsList.superAdmin, PermissionsList.support, PermissionsList.it],
        page: <SignatureManagement />,
    },
    {
        name: "Inventarisatie",
        path: "/inventarisatie",
        roles: [PermissionsList.superAdmin, PermissionsList.participant, PermissionsList.it],
        icon: IconInventory,
    },
    {
        name: "Kennisbank",
        path: "/kennisbank",
        roles: [PermissionsList.superAdmin, PermissionsList.participant, PermissionsList.it],
        icon: IconKnowledgeBase,
    },
    {
        name: "Servers",
        path: "/servers",
        roles: [PermissionsList.superAdmin, PermissionsList.it],
        icon: IconVMs,
    },
];

export const navigationItemsIT: INavigationItem[] = [
    {
        name: "VM's",
        path: "/VMs",
        roles: [PermissionsList.superAdmin, PermissionsList.it],
        icon: IconVMs,
    },
    {
        name: "VPN's",
        path: "/VPNs",
        roles: [PermissionsList.superAdmin, PermissionsList.it],
        icon: IconVPNs,
    },
];

export const navigationItemsAccount: INavigationItem[] = [
    {
        name: "Instellingen",
        path: "/settings",
        roles: [PermissionsList.superAdmin, PermissionsList.support, PermissionsList.participant, PermissionsList.it],
        icon: IconSettings,
    },
    {
        name: "Uitloggen",
        path: "/logout",
        roles: [PermissionsList.superAdmin, PermissionsList.support, PermissionsList.participant, PermissionsList.it],
        icon: IconLogout,
    },
];
