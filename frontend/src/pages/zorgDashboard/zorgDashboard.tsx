import DateTimeDisplay from "../../common/components/dateTimeDisplay";
import Card from "../../common/components/Card";

export default function ZorgDashboard() {
    return (
        <>
            <div className="">
                <div className="flex flex-row justify-between">
                    <div className="flex flex-col gap-[1.5rem]">
                        <div className="text-[22px] font-semibold text-(--color-darkblue)">Dashboard</div>

                        <DateTimeDisplay />
                    </div>

                    <div className="flex flex-row gap-[4rem]">
                        {/* values must be dynamic! */}
                        <Card title="Deelnemers aanwezig:" value={17} />
                        <Card title="Deelnemers totaal:" value={40} />
                    </div>
                </div>
            </div>
        </>
    );
}
