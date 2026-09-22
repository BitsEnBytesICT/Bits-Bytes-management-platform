import {useState} from "react";
import {IconProduct} from "../../../assets";
import SmallButton from "../../../common/components/SmallButton";

const rooms = ["Server ruimte", "Gymzaal"];

export default function FloorPlanPlaceholder() {
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

    return (
        <section aria-label="Plattegronden" className="mt-25">
            <div
                className="flex h-100 items-center justify-center rounded-[10px] border border-(--color-black)/5"
                aria-label={selectedRoom ? `Plattegrond ${selectedRoom}` : "Plattegrond"}>
                <p className="font-black text-(--color-orange)/50">Plattegronden komen hier</p>
            </div>
            <div className="mt-5.75 flex gap-7.5" role="group" aria-label="Kies een ruimte">
                {rooms.map(room => (
                    <SmallButton
                        key={room}
                        label={room}
                        icon={<img src={IconProduct} alt="" className="h-5 w-5" />}
                        active={selectedRoom === room}
                        pressed={selectedRoom === room}
                        classNameExtra={`h-8.75 rounded-[7.5px]! ${room === "Server ruimte" ? "w-37.25" : "w-30.25"}`}
                        onClick={() => setSelectedRoom(room)}
                    />
                ))}
            </div>
        </section>
    );
}
