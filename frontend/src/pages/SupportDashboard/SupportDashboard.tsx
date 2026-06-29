import Card from "../../common/components/Card";
import ParticipantsTable from "../../common/components/ParticipantsTable";
import Button from "../../common/components/Button";
import FloorPlans from "../../common/components/FloorPlans";
import Calendar from "../../common/components/Calendar";
import {IconAddUser, IconExport, IconLink} from "../../assets";
import DateTimeDisplay from "../../common/components/dateTimeDisplay";

export default function SupportDashboard() {
    return (
        <>
            <div className="flex flex-col gap-25">
                <div className="flex flex-row justify-between">
                    <div className="flex flex-col gap-6">
                        <div className="text-[22px] font-semibold text-(--color-darkblue)">Dashboard</div>

                        <DateTimeDisplay />
                    </div>

                    <div className="flex flex-row gap-8 min-[1000px]:gap-16">
                        <Card title="Deelnemers aanwezig:" value={17} />

                        <Card title="Deelnemers totaal:" value={40} />
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-row gap-6">
                            <Button
                                icon={<img className="select-none [-webkit-user-drag:none]" src={IconLink} />}
                                label="Cliendo"
                                onClick={() => window.open("https://www.google.nl", "_blank")}
                            />

                            <Button
                                icon={<img className="select-none [-webkit-user-drag:none]" src={IconLink} />}
                                label="ZilliZ"
                                onClick={() => window.open("https://www.google.nl", "_blank")}
                            />
                        </div>

                        <div className="flex flex-row gap-6">
                            <Button
                                icon={<img className="select-none [-webkit-user-drag:none]" src={IconAddUser} />}
                                label="Deelnemer toevoegen"
                                onClick={() => console.log("must be a different action")}
                            />

                            <Button
                                icon={<img className="select-none [-webkit-user-drag:none]" src={IconExport} />}
                                label="Exporteer"
                                onClick={() => console.log("must be a different action")}
                            />
                        </div>
                    </div>

                    <ParticipantsTable tableColumns={["firstname", "lastname", "organisation", "product", "active"]} />
                </div>

                <FloorPlans />

                <Calendar />
            </div>
        </>
    );
}
