import {useEffect, useState} from "react";

import DateRangePicker from "../../common/components/DateRangePicker";
import SmallButton from "../../common/components/SmallButton";
import SmallPopUp from "../../common/components/SmallPopUp";
import Table from "../../common/components/Table";

import type IAttendance from "../../types/compontents/IAttendance";
import type {IDateRange} from "../../types/compontents/IDateRangePicker";
import type IParticipant from "../../types/compontents/IParticipant";
import type {ITableColumn} from "../../types/compontents/ITable";

import {IconAddUser, IconDelete, IconDownload, IconEdit, IconExport, IconFilter, IconInfo} from "../../assets";
import {downloadPDF} from "../../common/buildPDF";
import {formatDate, fromBackendDate, isSvg} from "../../common/helperFunctions";
import useLocalStorage from "../../common/hooks/useLocalStorage";
import http from "../../common/http";
import ParticipantsService from "../Participants/Participants.service";
import SignatureManagementService from "./SignatureManagentService";
import SignatureCreatePopUp from "./components/SignatureCreatePopUp";
import SignaturePopUp from "./components/SignaturePopUp";
import SignaturesFilter from "./components/SignaturesFilter";
import SignaturesPDF from "./components/SignaturesPDF";

type AttendanceRow = IAttendance & {checked: boolean};

function ActionIcons(
    signature: IAttendance,
    onEditClick: (signature: IAttendance) => void,
    onExportClick: (signature: IAttendance) => void,
    onDeleteClick: (signature: IAttendance) => void,
    onInfoClick: (signature: IAttendance) => void,
) {
    return (
        <div className="flex flex-row gap-[10%]">
            <img
                onClick={() => onInfoClick(signature)}
                src={IconInfo}
                className="shrink-0 cursor-pointer select-none [-webkit-user-drag:none]"
            />
            <img
                onClick={() => onEditClick(signature)}
                src={IconEdit}
                className="shrink-0 cursor-pointer select-none [-webkit-user-drag:none]"
            />
            <img
                onClick={() => onExportClick(signature)}
                src={IconDownload}
                className="shrink-0 cursor-pointer select-none [-webkit-user-drag:none]"
            />
            <img
                onClick={() => onDeleteClick(signature)}
                src={IconDelete}
                className="shrink-0 cursor-pointer select-none [-webkit-user-drag:none]"
            />
        </div>
    );
}

export default function SignatureManagement() {
    const [signatures, setSignatures] = useState<IAttendance[]>([]);
    const [filteredSignatures, setFilteredSignatures] = useState<AttendanceRow[]>([]);
    const [participants, setParticipants] = useState<IParticipant[]>([]);
    const [isFilterShown, setIsFilterShown] = useState(false);
    const [dateRange, setDateRange] = useLocalStorage<IDateRange>("signatures.dateRange", {from: "", to: ""});

    const [infoSignature, setInfoSignature] = useState<IAttendance | null>(null);
    const [editSignature, setEditSignature] = useState<IAttendance | null>(null);
    const [deleteSignature, setDeleteSignature] = useState<IAttendance | null>(null);
    const [isCreateShown, setIsCreateShown] = useState(false);
    const [deleteSelection, setDeleteSelection] = useState<IAttendance[]>([]);

    const participantService: ParticipantsService = new ParticipantsService();
    const signatureService: SignatureManagementService = new SignatureManagementService();

    const signatureColumns: ITableColumn<IAttendance>[] = [
        {key: "id", label: "ID"},
        {
            key: "firstname",
            label: "Naam",
            sortable: true,
            render: row => findParticipant(row.participantID)?.firstname ?? "-",
        },
        {
            key: "lastname",
            label: "Achternaam",
            sortable: true,
            render: row => findParticipant(row.participantID)?.lastname ?? "-",
        },
        {key: "clockinDate", label: "Ingeklokt", render: row => formatDate(row.clockinDate)},
        {key: "clockoutDate", label: "Uitgeklokt", render: row => formatDate(row.clockoutDate)},
        {
            key: "workDuration",
            label: "Werkduur",
            render: row => (row.workDuration != null ? `${row.workDuration} min` : "-"),
        },
        {
            key: "signature",
            label: "Handtekening",
            copyable: false,
            sortable: false,
            render: row =>
                isSvg(row.signature) ? (
                    <img
                        src={`data:image/svg+xml;utf8,${encodeURIComponent(row.signature)}`}
                        className="h-10 max-w-full object-contain select-none [-webkit-user-drag:none]"
                    />
                ) : (
                    <span className="text-(--color-darkblue)/50">Niet ondertekend</span>
                ),
        },
        {
            key: "acties",
            label: "Acties",
            copyable: false,
            sortable: false,
            render: row =>
                ActionIcons(
                    row,
                    setEditSignature,
                    signature => exportSignatures([signature], `handtekening-${signature.id}.pdf`),
                    setDeleteSignature,
                    setInfoSignature,
                ),
        },
    ];

    const fetchData = async () => {
        const request = await http("/api/attendance", "POST");
        const response: (Omit<IAttendance, "clockinDate" | "clockoutDate"> & {
            clockinDate: string;
            clockoutDate?: string;
        })[] = await request.json();
        setSignatures(
            response.map(attendance => ({
                ...attendance,
                clockinDate: fromBackendDate(attendance.clockinDate),
                clockoutDate: attendance.clockoutDate ? fromBackendDate(attendance.clockoutDate) : undefined,
            })),
        );
    };

    const checkedSignatures = filteredSignatures.filter(s => s.checked);

    const findParticipant = (participantID: number) => participants.find(p => p.id === participantID);

    const exportSignatures = async (toExport: IAttendance[], fileName = "handtekeningen-export.pdf") => {
        if (toExport.length === 0) return;

        await downloadPDF(<SignaturesPDF signatures={toExport} participants={participants} />, fileName);
    };

    const deleteSelectedSignatures = async () => {
        const error = await signatureService.deleteSignatures(deleteSelection.map(signature => signature.id));
        if (error) console.error(error);

        setDeleteSelection([]);
        await fetchData();
    };

    useEffect(() => {
        fetchData();
        participantService.getParticipants().then(setParticipants);
    }, []);

    return (
        <div className="flex flex-col h-[calc(100vh-10rem)]">
            <div className="mb-4 flex flex-row justify-between">
                <div className="flex flex-row gap-6">
                    <SmallButton
                        onClick={() => setIsFilterShown(prev => !prev)}
                        icon={<img src={IconFilter} className="select-none [-webkit-user-drag:none]" />}
                        label="Filter"
                        active={isFilterShown}
                    />

                    <DateRangePicker value={dateRange} onChange={setDateRange} />
                </div>

                <div className="flex flex-row gap-6">
                    {checkedSignatures.length > 0 && (
                        <SmallButton
                            icon={<img src={IconDelete} className="select-none [-webkit-user-drag:none]" />}
                            label="Verwijder Selectie"
                            onClick={() => setDeleteSelection(checkedSignatures)}
                        />
                    )}

                    {checkedSignatures.length > 0 && (
                        <SmallButton
                            icon={<img src={IconExport} className="select-none [-webkit-user-drag:none]" />}
                            label="Exporteer Selectie"
                            onClick={() => exportSignatures(checkedSignatures)}
                        />
                    )}

                    <SmallButton
                        icon={<img src={IconAddUser} className="select-none [-webkit-user-drag:none]" />}
                        label="Handmatig Toevoegen"
                        onClick={() => setIsCreateShown(true)}
                    />

                    <SmallButton
                        icon={<img src={IconExport} className="select-none [-webkit-user-drag:none]" />}
                        label="Exporteer"
                        onClick={() => exportSignatures(filteredSignatures)}
                    />
                </div>
            </div>

            <SignaturesFilter
                signatures={signatures}
                participants={participants}
                isShown={isFilterShown}
                dateRange={dateRange}
                setFilteredSignatures={setFilteredSignatures}>
                <div
                    className="flex-1 min-h-0 [&_td:first-child]:w-12 [&_td:first-child]:overflow-hidden
                        [&_td:last-child]:w-32 [&_td:last-child]:overflow-hidden [&_th:first-child]:w-12
                        [&_th:last-child]:w-32">
                    <Table
                        columns={signatureColumns}
                        rows={filteredSignatures}
                        setRows={setFilteredSignatures}
                        rowKey="id"
                        checkBox={true}
                    />
                </div>
            </SignaturesFilter>

            {infoSignature && (
                <SignaturePopUp
                    mode="info"
                    signature={infoSignature}
                    participant={findParticipant(infoSignature.participantID)}
                    onClose={() => setInfoSignature(null)}
                />
            )}

            {isCreateShown && (
                <SignatureCreatePopUp
                    participants={participants}
                    onClose={() => setIsCreateShown(false)}
                    onSaved={fetchData}
                />
            )}

            {editSignature && (
                <SignaturePopUp
                    mode="edit"
                    signature={editSignature}
                    participant={findParticipant(editSignature.participantID)}
                    onClose={() => setEditSignature(null)}
                    onSaved={fetchData}
                />
            )}

            {deleteSelection.length > 0 && (
                <SmallPopUp
                    title="Verwijderen"
                    message={`Weet je zeker dat je ${deleteSelection.length} ${
                        deleteSelection.length === 1 ? "handtekening" : "handtekeningen"
                    } wil verwijderen?`}
                    onCancel={() => setDeleteSelection([])}
                    onConfirm={deleteSelectedSignatures}
                />
            )}

            {deleteSignature && (
                <SmallPopUp
                    title="Verwijderen"
                    message={`Weet je zeker dat je de handtekening van deelnemer ${deleteSignature.participantID} wil verwijderen?`}
                    onCancel={() => setDeleteSignature(null)}
                    onConfirm={() => {
                        setSignatures(signatures.filter(signature => signature.id !== deleteSignature.id));
                        setDeleteSignature(null);
                    }}
                />
            )}
        </div>
    );
}
