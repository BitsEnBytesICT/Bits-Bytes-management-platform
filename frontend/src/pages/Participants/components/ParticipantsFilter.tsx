import {useEffect, useRef, useState} from "react";

import Filter from "../../../common/components/Filter";

import type IFilter from "../../../types/compontents/IFilter";

interface IParticipantsFilter extends IFilter {
    isShown: boolean;
}

export default function ParticipantsFilter({filters, search, isShown}: IParticipantsFilter) {
    const [filterHeight, setFilterHeight] = useState(0);

    const filterContentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setFilterHeight(isShown ? (filterContentRef.current?.scrollHeight ?? 0) : 0);
    }, [isShown]);

    return (
        <div
            className={`${isShown ? "mb-4" : "mb-0"} overflow-hidden transition-[height,margin-bottom] duration-300
                ease-in-out`}
            style={{height: filterHeight}}>
            <div ref={filterContentRef}>
                <Filter filters={filters} search={search} />
            </div>
        </div>
    );
}
