import {useEffect, useRef, useState} from "react";
import type {ReactNode} from "react";

import Filter from "../../../common/components/Filter";

import useLocalStorage from "../../../common/hooks/useLocalStorage";

import type IAttendance from "../../../types/compontents/IAttendance";
import type IParticipant from "../../../types/compontents/IParticipant";

interface ISignaturesFilter {
    signatures: IAttendance[];
    participants: IParticipant[];
    isShown: boolean;
    children: ReactNode;
    setFilteredSignatures: (value: (IAttendance & {checked: boolean})[]) => void;
}

export default function SignaturesFilter({
    signatures,
    participants,
    isShown,
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
                signature.clockinDate,
                signature.clockoutDate,
                signature.workDuration,
            ].some(value =>
                String(value ?? "")
                    .toLowerCase()
                    .includes(term),
            );

        const matchesParticipant = !participantFilter || name === participantFilter;
        const matchesSigned =
            !signedFilter || (signature.signature ? "Ondertekend" : "Niet ondertekend") === signedFilter;
        const matchesStatus = !statusFilter || (signature.clockoutDate ? "Uitgeklokt" : "Ingeklokt") === statusFilter;

        return matchesSearch && matchesParticipant && matchesSigned && matchesStatus;
    }

    useEffect(() => {
        setFilterHeight(isShown ? (filterContentRef.current?.scrollHeight ?? 0) : 0);
    }, [isShown]);

    useEffect(() => {
        setFilteredSignatures(signatures.filter(matchesFilters).map(s => ({...s, checked: false})));
    }, [signatures, participants, searchTerm, participantFilter, signedFilter, statusFilter]);

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
            options: ["Ingeklokt", "Uitgeklokt"],
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
