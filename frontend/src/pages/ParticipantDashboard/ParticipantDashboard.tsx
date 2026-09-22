import {useState} from "react";
import {IconSettings, IconVMs} from "../../assets";
import Card from "../../common/components/Card";
import DateTimeDisplay from "../../common/components/DateTimeDisplay";
import PopUp from "../../common/components/PopUp";
import SmallButton from "../../common/components/SmallButton";
import ParticipantDashboardService from "./ParticipantDashboard.service";
import DashboardIcon from "./components/DashboardIcon";
import FloorPlanPlaceholder from "./components/FloorPlanPlaceholder";
import ParticipantDashboardTable from "./components/ParticipantDashboardTable";
import ShortcutSection from "./components/ShortcutSection";

const service = new ParticipantDashboardService();

export default function ParticipantDashboard() {
    const [vmAction, setVmAction] = useState<string | null>(null);
    const summary = service.getDemoSummary();

    return (
        <div className="mx-auto max-w-240 pt-17.5 pb-57.5">
            <header className="flex flex-wrap items-start justify-between gap-8">
                <div className="flex flex-col gap-6">
                    <h1 className="text-[22px] leading-7 font-semibold text-(--color-darkblue)">Dashboard</h1>
                    <DateTimeDisplay muted />
                </div>
                <div className="flex gap-8 min-[1200px]:gap-16.25" aria-label="Voorbeeldstatistieken">
                    <Card
                        title="VM’s Online:"
                        value={summary.onlineVirtualMachines}
                        classNameExtra="h-25 pl-6.25! pb-4.75! rounded-[7.5px]! [&>div]:leading-[1.25]"
                    />
                    <Card
                        title="Opslag Windows:"
                        value={summary.windowsStorage}
                        classNameExtra="h-25 pl-7.25! pb-4.75! rounded-[7.5px]! [&>div]:leading-[1.25]"
                    />
                </div>
            </header>

            <ShortcutSection />

            <section aria-label="Virtuele machines" className="mt-25">
                <div className="flex min-h-8.75 items-center justify-between gap-5">
                    <p className="text-xs text-(--color-darkblue)/60">Voorbeeldgegevens · VM-koppeling volgt</p>
                    <div className="flex gap-7.5">
                        <SmallButton
                            label="VM Toevoegen"
                            icon={<DashboardIcon src={IconVMs} />}
                            classNameExtra="h-8.75 w-37.5 rounded-[7.5px]!"
                            onClick={() => setVmAction("VM toevoegen")}
                        />
                        <SmallButton
                            label="Beheer"
                            icon={<DashboardIcon src={IconSettings} />}
                            classNameExtra="h-8.75 w-25.75 rounded-[7.5px]!"
                            onClick={() => setVmAction("VM-beheer")}
                        />
                    </div>
                </div>
                <ParticipantDashboardTable />
            </section>

            <FloorPlanPlaceholder />

            {vmAction && (
                <PopUp
                    compact
                    title={vmAction}
                    onClose={() => setVmAction(null)}
                    child={
                        <div className="flex flex-col items-center gap-6 text-center">
                            <p>
                                Deze functie is nog niet beschikbaar. De virtuele machines op het dashboard zijn
                                voorbeelden.
                            </p>
                            <SmallButton label="Sluiten" onClick={() => setVmAction(null)} />
                        </div>
                    }
                />
            )}
        </div>
    );
}
