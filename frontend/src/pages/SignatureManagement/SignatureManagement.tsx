import SmallButton from "../../common/components/SmallButton";
import Table from "../../common/components/Table";

import type {ITableColumn} from "../../types/compontents/ITable";

import {IconAddUser, IconCalendar, IconDelete, IconEdit, IconExport, IconFilter, IconInfo} from "../../assets";

interface ISignature {
    id: number;
    date: string;
    firstname: string;
    lastname: string;
    organisation: string;
    clockedin: string;
    clockedout: string;
    duration: string;
    signature: string;
}

const signatures: ISignature[] = [
    {
        id: 1,
        date: "07-29-2026",
        firstname: "P",
        lastname: "Diddy",
        organisation: "Epstein island",
        clockedin: "10:15",
        clockedout: "3:55",
        duration: "10:15 - 3:55",
        signature: "Plaatje hier",
    },
];

function SelectCheckbox() {
    return <input type="checkbox" className="w-4 h-4 accent-(--color-darkblue) align-middle cursor-pointer" />;
}

function ActionIcons() {
    return (
        <div className="flex flex-row gap-2 items-center">
            <img src={IconEdit} className="size-4 shrink-0 cursor-pointer select-none [-webkit-user-drag:none]" />
            <img src={IconExport} className="size-4 shrink-0 cursor-pointer select-none [-webkit-user-drag:none]" />
            <img src={IconDelete} className="size-4 shrink-0 cursor-pointer select-none [-webkit-user-drag:none]" />
            <img src={IconInfo} className="size-4 shrink-0 cursor-pointer select-none [-webkit-user-drag:none]" />
        </div>
    );
}

const signatureColumns: ITableColumn<ISignature>[] = [
    {
        key: "select",
        label: "",
        copyable: false,
        sortable: false,
        render: () => <SelectCheckbox />,
    },
    {key: "date", label: "Datum"},
    {key: "firstname", label: "Naam"},
    {key: "lastname", label: "Achternaam"},
    {key: "organisation", label: "Organisatie"},
    {key: "clockedin", label: "Clocked-In"},
    {key: "clockedout", label: "Clocked-Out"},
    {key: "duration", label: "Duratie"},
    {key: "signature", label: "Handtekening"},
    {
        key: "acties",
        label: "Acties",
        copyable: false,
        sortable: false,
        render: () => <ActionIcons />,
    },
];

export default function SignatureManagement() {
    return (
        <div className="flex flex-col h-[calc(100vh-10rem)]">
            <div className="mb-4 flex flex-row justify-between">
                <div className="flex flex-row gap-6">
                    <SmallButton
                        icon={<img src={IconFilter} className="select-none [-webkit-user-drag:none]" />}
                        label=""
                    />
                </div>

                <div className="flex flex-row gap-6">
                    <SmallButton
                        icon={<img src={IconDelete} className="select-none [-webkit-user-drag:none]" />}
                        label="Verwijder Selectie"
                    />

                    <SmallButton
                        icon={<img src={IconExport} className="select-none [-webkit-user-drag:none]" />}
                        label="Exporteer Selectie"
                    />

                    <SmallButton
                        icon={<img src={IconAddUser} className="select-none [-webkit-user-drag:none]" />}
                        label="Handmatig Toevoegen"
                    />

                    <SmallButton
                        icon={<img src={IconExport} className="select-none [-webkit-user-drag:none]" />}
                        label="Exporteer"
                    />
                </div>
            </div>

            <label
                className="mb-4 py-2 px-4 flex flex-row gap-2.5 items-center w-full text-[14px] font-semibold
                    bg-(--color-white) rounded-lg
                    shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)] transition-shadow
                    focus-within:shadow-[inset_0_0_0_1px_var(--color-darkblue)]">
                <img src={IconCalendar} className="shrink-0 select-none [-webkit-user-drag:none]" />

                <input
                    type="text"
                    placeholder="Datum kiezen"
                    className="flex-1 min-w-0 text-(--color-darkblue) placeholder:text-(--color-darkblue)/50
                        bg-transparent outline-none"
                />
            </label>

            <div
                className="flex-1 min-h-0 [&_td:first-child]:w-12 [&_td:first-child]:overflow-hidden
                    [&_td:last-child]:w-32 [&_td:last-child]:overflow-hidden [&_th:first-child]:w-12
                    [&_th:last-child]:w-32">
                <Table columns={signatureColumns} rows={signatures} rowKey="id" />
            </div>
        </div>
    );
}
