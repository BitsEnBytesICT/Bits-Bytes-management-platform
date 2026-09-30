import http from "../../http";
import type IShortcut from "../../../types/accounts/IShortcut";

export default class ShortcutService {
    getShortcuts = async (): Promise<IShortcut[]> => {
        const response = await http("/api/account/shortcuts", "POST");
        if (response.status === 200) return await response.json();
        else return [];
    };

    updateShortcuts = async (shortcuts: IShortcut[]): Promise<string[]> => {
        const response = await http("/api/account/shortcuts/update", "POST", {shortcuts: shortcuts});
        if (response.status === 200) return;
        else return await response.json();
    };

    getFaviconUrl = (url: string): string | undefined => {
        try {
            return `https://www.google.com/s2/favicons?sz=64&domain=${new URL(url).hostname}`;
        } catch {
            return undefined;
        }
    };
}
