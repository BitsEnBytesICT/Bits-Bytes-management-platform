import {useState} from "react";
import {IconDelete, IconEdit, IconLink} from "../../../assets";
import type IShortcut from "../../../types/participantDashboard/IShortcut";
import ParticipantDashboardService from "../ParticipantDashboard.service";

interface IShortcutTile {
    shortcut: IShortcut;
    onEdit: () => void;
    onDelete: () => void;
}

const service = new ParticipantDashboardService();

export default function ShortcutTile({shortcut, onEdit, onDelete}: IShortcutTile) {
    const [failedFavicon, setFailedFavicon] = useState<string>();
    const faviconUrl = service.getFaviconUrl(shortcut.url);

    const actionClassName = `p-1 rounded cursor-pointer hover:bg-(--color-darkblue)/10
        focus-visible:outline-2 focus-visible:outline-(--color-darkblue)`;

    return (
        <div className="group relative h-25 w-42.5">
            <a
                href={shortcut.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${shortcut.label} (opent in een nieuw tabblad)`}
                title={shortcut.label}
                className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[7.5px]
                    border border-(--color-black)/5 bg-(--color-white) text-(--color-darkblue) transition-colors
                    duration-300 group-hover:bg-(--color-darkblue)/5 group-focus-within:bg-(--color-darkblue)/5
                    focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--color-darkblue)
                    motion-reduce:transition-none">
                <img
                    src={failedFavicon === faviconUrl ? IconLink : faviconUrl}
                    alt=""
                    referrerPolicy="no-referrer"
                    onError={() => setFailedFavicon(faviconUrl)}
                    className="absolute left-16.25 h-10 w-10 object-contain select-none [-webkit-user-drag:none]
                        transition-transform duration-300 group-hover:-translate-x-21 group-focus-within:-translate-x-21
                        motion-reduce:transition-none"
                />
                <span
                    aria-hidden="true"
                    className="line-clamp-2 max-w-25 text-center text-base leading-5 font-semibold wrap-anywhere
                        opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100
                        motion-reduce:transition-none">
                    {shortcut.label}
                </span>
            </a>

            <div
                className="absolute bottom-1 right-2 flex gap-1 opacity-0 pointer-events-none transition-opacity
                    duration-300 group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100
                    group-focus-within:pointer-events-auto motion-reduce:transition-none">
                <button
                    type="button"
                    aria-label={`${shortcut.label} bewerken`}
                    onClick={onEdit}
                    className={actionClassName}>
                    <img src={IconEdit} alt="" className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    aria-label={`${shortcut.label} verwijderen`}
                    onClick={onDelete}
                    className={actionClassName}>
                    <img src={IconDelete} alt="" className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
