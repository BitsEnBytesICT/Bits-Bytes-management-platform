import {useEffect, useRef, useState} from "react";
import type {ReactNode} from "react";

import Filter from "../../../common/components/Filter";

import {formatDate, isSvg} from "../../../common/helperFunctions";
import useLocalStorage from "../../../common/hooks/useLocalStorage";

import type IAttendance from "../../../types/compontents/IAttendance";
import type {IDateRange} from "../../../types/compontents/IDateRangePicker";
import type {IParticipant} from "../../../types/compontents/IParticipant";

interface ISignaturesFilter {
    signatures: IAttendance[];
    participants: IParticipant[];
    isShown: boolean;
    dateRange: IDateRange;
    children: ReactNode;
    setFilteredSignatures: (value: (IAttendance & {checked: boolean})[]) => void;
}

export default function SignaturesFilter({
    signatures,
    participants,
    isShown,
    dateRange,
    children,
    setFilteredSignatures,
}: ISignaturesFilter) {
    const [searchTerm, setSearchTerm] = useLocalStorage("signatures.searchTerm", "");
    const [participantFilter, setParticipantFilter] = useLocalStorage("signatures.participantFilter", "");
    const [signedFilter, setSignedFilter] = useLocalStorage("signatures.signedFilter", "");
    const [statusFilter, setStatusFilter] = useLocalStorage("signatures.statusFilter", "");
    const [filterHeight, setFilterHeight] = useState(0);

    const filterContentRef = useRef<HTMLDivElement>(null);

    function participantName(participantID: number): string {
        const participant = participants.find(p => p.id === participantID);

        return participant ? `${participant.firstname} ${participant.lastname}` : "";
    }

    // lokale "YYYY-MM-DD" zodat hij direct te vergelijken is met de waarde van een date input
    function toDayKey(date: Date): string {
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${date.getFullYear()}-${month}-${day}`;
    }

    function matchesFilters(signature: IAttendance): boolean {
        const term = searchTerm.toLowerCase();
        const name = participantName(signature.participantID);

        // de handtekening zelf is een svg string en wordt daarom niet doorzocht
        const matchesSearch =
            !searchTerm ||
            [
                signature.id,
                signature.participantID,
                name,
                formatDate(signature.clockinDate),
                formatDate(signature.clockoutDate),
                signature.workDuration != null ? `${signature.workDuration} min` : "-",
            ].some(value =>
                String(value ?? "")
                    .toLowerCase()
                    .includes(term),
            );

        const matchesParticipant = !participantFilter || name === participantFilter;
        const matchesSigned =
            !signedFilter || (isSvg(signature.signature) ? "Ondertekend" : "Niet ondertekend") === signedFilter;
        const matchesStatus = !statusFilter || (signature.clockoutDate ? "Afwezig" : "Aanwezig") === statusFilter;

        const day = toDayKey(signature.clockinDate);
        const matchesDate = (!dateRange.from || day >= dateRange.from) && (!dateRange.to || day <= dateRange.to);

        return matchesSearch && matchesParticipant && matchesSigned && matchesStatus && matchesDate;
    }

    useEffect(() => {
        setFilterHeight(isShown ? (filterContentRef.current?.scrollHeight ?? 0) : 0);
    }, [isShown]);

    useEffect(() => {
        setFilteredSignatures(signatures.filter(matchesFilters).map(s => ({...s, checked: false})));
    }, [
        signatures,
        participants,
        searchTerm,
        participantFilter,
        signedFilter,
        statusFilter,
        dateRange.from,
        dateRange.to,
    ]);

    const participantNames = [...new Set(signatures.map(s => participantName(s.participantID)).filter(Boolean))];

    const filterGroups = [
        {
            label: "Deelnemer",
            options: participantNames,
            value: participantFilter,
            onChange: setParticipantFilter,
        },
        {
            label: "Handtekening",
            options: ["Ondertekend", "Niet ondertekend"],
            value: signedFilter,
            onChange: setSignedFilter,
        },
        {
            label: "Status",
            options: ["Aanwezig", "Afwezig"],
            value: statusFilter,
            onChange: setStatusFilter,
        },
    ];

    return (
        <>
            <div
                className={`${isShown ? "mb-4" : "mb-0"} overflow-hidden transition-[height,margin-bottom] duration-300
                    ease-in-out`}
                style={{height: filterHeight}}>
                <div ref={filterContentRef}>
                    <Filter
                        filters={filterGroups}
                        search={{
                            value: searchTerm,
                            onChange: setSearchTerm,
                            placeholder: "Zoek",
                        }}
                    />
                </div>
            </div>

            {children}
        </>
    );
}
