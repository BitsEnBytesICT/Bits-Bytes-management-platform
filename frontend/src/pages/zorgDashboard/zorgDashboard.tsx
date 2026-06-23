import DateTimeDisplay from "../../common/components/DateTimeDisplay";
import Card from "../../common/components/Card";
import DeelnemerTable from "../../common/components/DeelnemerTable";
import Button from "../../common/components/Button";
import Agenda from "../../common/components/Agenda";

import {IconAddUser, IconExport, IconLink} from "../../assets";

export default function ZorgDashboard() {
    return (
        <>
            <div className="mx-auto flex max-w-[87.5rem] flex-col gap-25">
                <div className="flex flex-row justify-between">
                    <div className="flex flex-col gap-[1.5rem]">
                        <div className="text-[22px] font-semibold text-(--color-darkblue)">Dashboard</div>
                        <DateTimeDisplay />
                    </div>

                    <div className="flex flex-row gap-[2rem] min-[1000px]:gap-[4rem]">
                        <Card title="Deelnemers aanwezig:" value={17} />
                        <Card title="Deelnemers totaal:" value={40} />
                    </div>
                </div>

                <div className="flex flex-col gap-[1rem]">
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-row gap-[1.5rem]">
                            <Button
                                icon={<img src={IconLink} />}
                                label="Cliendo"
                                onClick={() => window.open("https://www.google.nl", "_blank")}
                            />

                            <Button
                                icon={<img src={IconLink} />}
                                label="ZilliZ"
                                onClick={() => window.open("https://www.google.nl", "_blank")}
                            />
                        </div>

                        <div className="flex flex-row gap-[1.5rem]">
                            <Button
                                icon={<img src={IconAddUser} />}
                                label="Deelnemer toevoegen"
                                onClick={() => console.log("must be a different action")}
                            />

                            <Button
                                icon={<img src={IconExport} />}
                                label="Exporteer"
                                onClick={() => console.log("must be a different action")}
                            />
                        </div>
                    </div>

                    <DeelnemerTable tableColumns={["firstname", "lastname", "organisation", "product", "active"]} />
                </div>

                <Agenda />
            </div>
        </>
    );
}
