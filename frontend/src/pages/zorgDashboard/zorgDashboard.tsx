import DateTimeDisplay from "../../common/components/dateTimeDisplay";
import Card from "../../common/components/Card";

export default function ZorgDashboard() {
    return (
        <>
            <div className="">
                <div className="flex flex-row gap-[1.5rem]">
                    <div className="flex flex-col">
                        <div className="text-[22px] font-semibold text-(--color-darkblue)">(Zorg) Dashboard</div>

                        <DateTimeDisplay />
                    </div>

                    <Card title="Deelnemers aanwezig:" value={17} />
                </div>
            </div>
        </>
    );
}
