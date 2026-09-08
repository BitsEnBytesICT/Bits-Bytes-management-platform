import {useEffect, useState} from "react";

import SmallButton from "../../common/components/SmallButton";
// import SmallPopUp from "../../common/components/SmallPopUp";
import Table from "../../common/components/Table";

import type {ITableColumn} from "../../types/compontents/ITable";

import {IconAddUser, IconCalendar, IconDelete, IconEdit, IconExport, IconFilter, IconInfo} from "../../assets";
import http from "../../common/http";

interface IAttendance {
    id?: number;
    participantID: number;
    clockinDate: string;
    clockoutDate?: string;
    workDuration?: number;
    signature: string;
}

type AttendanceRow = IAttendance & {checked: boolean};

function ActionIcons(
    signature: IAttendance,
    onEditClick: (signature: IAttendance) => void,
    onExportClick: (signature: IAttendance) => void,
    onDeleteClick: (signature: IAttendance) => void,
    onInfoClick: (signature: IAttendance) => void,
) {
    return (
        <div className="flex flex-row gap-2 items-center">
            <img
                onClick={() => onEditClick(signature)}
                src={IconEdit}
                className="size-4 shrink-0 cursor-pointer select-none [-webkit-user-drag:none]"
            />
            <img
                onClick={() => onExportClick(signature)}
                src={IconExport}
                className="size-4 shrink-0 cursor-pointer select-none [-webkit-user-drag:none]"
            />
            <img
                onClick={() => onDeleteClick(signature)}
                src={IconDelete}
                className="size-4 shrink-0 cursor-pointer select-none [-webkit-user-drag:none]"
            />
            <img
                onClick={() => onInfoClick(signature)}
                src={IconInfo}
                className="size-4 shrink-0 cursor-pointer select-none [-webkit-user-drag:none]"
            />
        </div>
    );
}

export default function SignatureManagement() {
    const [signatures, setSignatures] = useState<AttendanceRow[]>([]);

    const [_infoSignature, setInfoSignature] = useState<IAttendance | null>(null);
    const [_editSignature, setEditSignature] = useState<IAttendance | null>(null);
    const [_deleteSignature, setDeleteSignature] = useState<IAttendance | null>(null);

    const signatureColumns: ITableColumn<IAttendance>[] = [
        {key: "id", label: "id"},
        {key: "participantID", label: "participantID"},
        {key: "clockinDate", label: "clockinDate"},
        {key: "clockoutDate", label: "clockoutDate"},
        {key: "workDuration", label: "workDuration"},
        {key: "signature", label: "signature"},
        {
            key: "acties",
            label: "Acties",
            copyable: false,
            sortable: false,
            render: row =>
                ActionIcons(
                    row,
                    setEditSignature,
                    _signature => {
                        //signature hier exporten?
                    },
                    setDeleteSignature,
                    setInfoSignature,
                ),
        },
    ];

    const fetchData = async () => {
        const request = await http("/api/attendance", "GET");
        const response: IAttendance[] = await request.json();
        setSignatures(response.map(row => ({...row, checked: false})));
    };

    useEffect(() => {
        fetchData();
    }, []);

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
                        onClick={() => fetchData()}
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
                <Table
                    columns={signatureColumns}
                    rows={signatures}
                    setRows={setSignatures}
                    rowKey="id"
                    checkBox={true}
                />
            </div>

            {/* {infoSignature && (
                <SmallPopUp
                    title="Details"
                    message={`${infoSignature.firstname} ${infoSignature.lastname} — ${infoSignature.organisation}, ${infoSignature.date} (${infoSignature.duration})`}
                    onCancel={() => setInfoSignature(null)}
                    onConfirm={() => setInfoSignature(null)}
                />
            )}

            {editSignature && (
                <SmallPopUp
                    title="Bewerken"
                    message={`Bewerken van ${editSignature.firstname} ${editSignature.lastname} nog niet geïmplementeerd.`}
                    onCancel={() => setEditSignature(null)}
                    onConfirm={() => setEditSignature(null)}
                />
            )} */}
            {/* 
            {deleteSignature && (
                <SmallPopUp
                    title="Verwijderen"
                    message={`Weet je zeker dat je de handtekening van ${deleteSignature.firstname} ${deleteSignature.lastname} wil verwijderen?`}
                    onCancel={() => setDeleteSignature(null)}
                    onConfirm={() => {
                        setSignatures(signatures.filter(signature => signature.id !== deleteSignature.id));
                        setDeleteSignature(null);
                    }}
                />
            )} */}
        </div>
    );
}
