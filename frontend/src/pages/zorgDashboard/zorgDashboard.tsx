import DateTimeDisplay from "./components/dateTimeDisplay";

export default function ZorgDashboard() {
    return (
        <>
            <div className="container_top">
                <div className="flex flex-col gap-[1.5rem]">
                    <div className="text-[22px] font-semibold text-(--color-darkblue)">(Zorg) Dashboard</div>
                    <DateTimeDisplay />
                </div>
            </div>
        </>
    );
}
