import {useState} from "react";

import ShortcutService from "./Shortcut.service";

import type IShortcutTile from "../../../types/compontents/IShortcutTile";

import {IconLink} from "../../../assets";

export const tileClassName = `h-15 w-30 flex items-center justify-center relative overflow-hidden bg-(--color-white)
    rounded-lg cursor-pointer transition-colors duration-500 ease-in-out hover:bg-(--color-darkblue)/5
    shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)]`;

export default function ShortcutTile({shortcut}: IShortcutTile) {
    const [hasFailedFavicon, setHasFailedFavicon] = useState(false);

    const service = new ShortcutService();

    const favicon = service.getFaviconUrl(shortcut.url);

    return (
        <div className="group">
            <div onClick={() => window.open(shortcut.url, "_blank")} title={shortcut.label} className={tileClassName}>
                <img
                    onError={() => setHasFailedFavicon(true)}
                    src={favicon && !hasFailedFavicon ? favicon : IconLink}
                    className="absolute size-6 object-contain select-none [-webkit-user-drag:none] transition-transform
                        duration-500 ease-in-out group-hover:-translate-x-9.5"
                />

                <span
                    className="ml-7 max-w-17 text-sm font-semibold text-center text-(--color-darkblue) select-none
                        opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100">
                    {shortcut.label}
                </span>
            </div>
        </div>
    );
}
