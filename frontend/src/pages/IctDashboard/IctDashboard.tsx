// import {useState} from 'react'
// import {type IParticipant} from "../../types/compontents/IParticipant";
import DateTimeDisplay from "../../common/components/DateTimeDisplay";
import Card from "../../common/components/Card";
import Shortcuts from "../../common/components/Shortcuts/Shortcuts";
import {IconSettings, IconExport} from "../../assets";
import SmallButton from "../../common/components/SmallButton";
import IctDashboardTable from "./components/IctDashboardTable";
import {useState} from "react";

let storageUsed = 20;
let storageTotal = 40;
let vmOnline = 5;

export default function IctDashboard() {
    // const [presentParticipants, setPresentParticipants] = useState<IParticipant[]>([]);
    const [serverOnline, setServerOnline] = useState<any[]>([]);
    return (
        <div className="flex flex-col gap-25">
            <div className="flex flex-row justify-between">
                <div className="flex flex-col gap-6">
                    <div className="text-[22px] font-semibold text-(--color-darkblue)">ICT-Dashboard</div>

                    <DateTimeDisplay />
                </div>

                <div className="flex flex-row gap-8 min-[1000px]:gap-16">
                    <Card title="VM's Online" value={vmOnline} />
                    <Card title="Opslag Windows:" value={`${storageUsed}GB/${storageTotal}GB`} />
                </div>
            </div>
            <Shortcuts />

            <div className="flex flex-col gap-4">
                <div className="flex flex-row justify-end">
                    <div className="flex flex-row gap-6">
                        <SmallButton
                            icon={<img className="select-none [-webkit-user-drag:none]" src={IconSettings} />}
                            label="VM Toevoegen"
                        />

                        <SmallButton
                            label="Beheer"
                            icon={<img className="select-none [-webkit-user-drag:none]" src={IconExport} />}
                            active={false}
                        />
                    </div>
                </div>
            </div>
            <IctDashboardTable serverOnline={serverOnline} setServerOnline={setServerOnline} />
        </div>
    );
}
