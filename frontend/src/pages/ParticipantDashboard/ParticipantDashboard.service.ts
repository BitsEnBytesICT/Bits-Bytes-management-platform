import type IShortcut from "../../types/participantDashboard/IShortcut";
import type IVirtualMachine from "../../types/participantDashboard/IVirtualMachine";

export const SHORTCUTS_STORAGE_KEY = "participantDashboard.shortcuts.v1";

export default class ParticipantDashboardService {
    normalizeWebsite = (value: string): string => {
        const input = value.trim();
        const hasControlCharacters = [...input].some(character => character.charCodeAt(0) <= 32);

        if (!input || input.length > 2048 || hasControlCharacters || input.includes("\\")) {
            throw new Error("Vul een geldig websiteadres in.");
        }

        const hasScheme = /^[a-z][a-z\d+.-]*:/i.test(input);
        const isHostWithPort = /^(?:localhost|[^/?#:@\s]+\.[^/?#:@\s]+):\d+(?:[/?#]|$)/i.test(input);
        let url: URL;

        try {
            url = new URL(hasScheme && !isHostWithPort ? input : `https://${input}`);
        } catch {
            throw new Error("Vul een geldig websiteadres in.");
        }

        if (!["http:", "https:"].includes(url.protocol) || !url.hostname || url.username || url.password) {
            throw new Error("Gebruik een http- of https-adres zonder inloggegevens.");
        }

        return url.href;
    };

    validateShortcut = (label: string, website: string): Pick<IShortcut, "label" | "url"> => {
        const trimmedLabel = label.trim();

        if (!trimmedLabel || trimmedLabel.length > 50) {
            throw new Error("Vul een naam in van maximaal 50 tekens.");
        }

        return {label: trimmedLabel, url: this.normalizeWebsite(website)};
    };

    readShortcuts = (value: unknown): IShortcut[] => {
        if (!Array.isArray(value)) return [];

        const shortcuts: IShortcut[] = [];
        const ids = new Set<string>();

        for (const item of value) {
            if (
                !item ||
                typeof item !== "object" ||
                typeof item.id !== "string" ||
                !item.id.trim() ||
                ids.has(item.id) ||
                typeof item.label !== "string" ||
                typeof item.url !== "string"
            ) {
                continue;
            }

            try {
                shortcuts.push({id: item.id, ...this.validateShortcut(item.label, item.url)});
                ids.add(item.id);
            } catch {
                // Browser storage is untrusted; skip invalid entries instead of rendering unsafe links.
                continue;
            }
        }

        return shortcuts;
    };

    getFaviconUrl = (website: string): string => {
        const url = new URL(this.normalizeWebsite(website));
        return new URL("/favicon.ico", url.origin).href;
    };

    // Figma example data only. Replace these methods when the participant VM API is available.
    getDemoSummary = () => ({onlineVirtualMachines: 4, windowsStorage: "40GB / 80GB"});

    getDemoVirtualMachines = (): IVirtualMachine[] =>
        (["online", "offline", "offline", "online"] as const).map((status, index) => ({
            id: `demo-vm-${index + 1}`,
            hostname: "Proxmox-1",
            ipAddress: "10.10.10.10",
            operatingSystem: index === 1 ? "Windows" : "Ubuntu 22.04",
            status,
            usedStorage: 45,
            totalStorage: 100,
        }));
}
