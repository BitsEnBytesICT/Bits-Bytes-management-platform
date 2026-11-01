import {useEffect, useState} from "react";

import Card from "../../common/components/Card";
import ConfirmButton from "../../common/components/ConfirmButton";
import DateTimeDisplay from "../../common/components/DateTimeDisplay";
import FloorPlans from "../../common/components/floorplans/FloorPlans";
import Icon from "../../common/components/Icon";
import Shortcuts from "../../common/components/Shortcuts/Shortcuts";
import SmallButton from "../../common/components/SmallButton";
import SmallPopUp from "../../common/components/SmallPopUp";

import ParticipantDashboardTable from "./components/ParticipantDashboardTable";
import ParticipantDashboardService from "./ParticipantDashboard.service";

import type {IParticipantWithSchedules} from "../../types/compontents/IParticipant";
import type {IRoom} from "../../types/floorPlans/IRoom";

import {IconInventory, IconKnowledgeBase, IconSettings, IconVMs} from "../../assets";

export default function ParticipantDashboard() {
    const [virtualMachines, setVirtualMachines] = useState(() =>
        new ParticipantDashboardService().getVirtualMachines(),
    );
    const [participants, setParticipants] = useState<IParticipantWithSchedules[]>([]);
    const [rooms, setRooms] = useState<IRoom[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [reloadIndex, setReloadIndex] = useState(0);
    const [placeholderTitle, setPlaceholderTitle] = useState<string>();

    const onlineMachines = virtualMachines.filter(machine => machine.online).length;
    const windowsMachine = virtualMachines.find(machine => machine.operatingSystem === "Windows");

    useEffect(() => {
        const service = new ParticipantDashboardService();
        let cancelled = false;

        Promise.all([service.getRooms(), service.getParticipants()])
            .then(([rooms, participants]) => {
                if (cancelled) return;
                setRooms(rooms);
                setParticipants(participants);
            })
            .catch(() => {
                if (!cancelled) setHasError(true);
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [reloadIndex]);

    return (
        <>
            <div className="flex flex-col gap-16 min-[1000px]:gap-25">
                <div className="flex flex-col gap-8 min-[900px]:flex-row min-[900px]:justify-between">
                    <div className="pl-4 min-[1000px]:pl-0 flex flex-col gap-6">
                        <h1 className="text-[22px] font-semibold text-(--color-darkblue)">Dashboard</h1>

                        <DateTimeDisplay />
                    </div>

                    <div className="flex flex-row flex-wrap gap-4 min-[1000px]:gap-16">
                        <Card title="VM's online:" value={onlineMachines} />

                        <Card
                            title="Opslag Windows:"
                            value={
                                windowsMachine
                                    ? `${windowsMachine.storageUsed} GB / ${windowsMachine.storageTotal} GB`
                                    : "—"
                            }
                        />
                    </div>
                </div>

                <Shortcuts
                    fixedShortcuts={[
                        {
                            shortcut: {label: "Inventarisatie", url: "/inventarisatie"},
                            icon: IconInventory,
                            onClick: () => setPlaceholderTitle("Inventarisatie"),
                        },
                        {
                            shortcut: {label: "Kennisbank", url: "/kennisbank"},
                            icon: IconKnowledgeBase,
                            onClick: () => setPlaceholderTitle("Kennisbank"),
                        },
                        {shortcut: {label: "Google", url: "https://www.google.com"}},
                        {shortcut: {label: "Google Calendar", url: "https://calendar.google.com"}},
                    ]}
                />

                <section aria-label="Virtuele machines" className="flex flex-col gap-4">
                    <div className="flex flex-row flex-wrap gap-4 items-center justify-between">
                        <span className="text-sm text-(--color-darkblue)/70">VM's en opslag: voorbeeldgegevens</span>

                        <div className="flex flex-row flex-wrap gap-6">
                            <SmallButton
                                icon={<Icon src={IconVMs} />}
                                label="VM toevoegen"
                                onClick={() => setPlaceholderTitle("VM toevoegen")}
                            />

                            <SmallButton
                                icon={<Icon src={IconSettings} />}
                                label="Beheer"
                                onClick={() => setPlaceholderTitle("VM-beheer")}
                            />
                        </div>
                    </div>

                    <ParticipantDashboardTable
                        virtualMachines={virtualMachines}
                        setVirtualMachines={setVirtualMachines}
                    />
                </section>

                <section aria-label="Plattegronden" aria-busy={isLoading}>
                    {isLoading || hasError || rooms.length === 0 ? (
                        <div
                            className="flex flex-col gap-4 items-center justify-center h-100 text-center
                                text-(--color-darkblue) rounded-lg
                                shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)]"
                            role="status">
                            <p>
                                {isLoading
                                    ? "Plattegronden laden..."
                                    : hasError
                                      ? "De plattegronden konden niet geladen worden."
                                      : "Er zijn nog geen plattegronden beschikbaar."}
                            </p>

                            {hasError && !isLoading && (
                                <SmallButton
                                    label="Opnieuw proberen"
                                    onClick={() => {
                                        setIsLoading(true);
                                        setHasError(false);
                                        setReloadIndex(index => index + 1);
                                    }}
                                />
                            )}
                        </div>
                    ) : (
                        <FloorPlans
                            rooms={rooms}
                            participants={participants}
                            setParticipants={setParticipants}
                            stacked
                            dayButtons={false}
                            height="h-100"
                        />
                    )}
                </section>
            </div>

            {placeholderTitle && (
                <SmallPopUp
                    title={placeholderTitle}
                    message="Deze functie is nog niet beschikbaar."
                    onCancel={() => setPlaceholderTitle(undefined)}
                    confirmationButtons={[
                        <ConfirmButton key="close" onClick={() => setPlaceholderTitle(undefined)} variant="primary">
                            Sluiten
                        </ConfirmButton>,
                    ]}
                />
            )}
        </>
    );
}
