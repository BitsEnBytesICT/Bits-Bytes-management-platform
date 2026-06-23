import {useState} from "react";

import Button from "./Button";

import {IconProduct} from "../../assets";

const floorPlans = [{label: "Server ruimte"}, {label: "Gymzaal"}, {label: "Stille ruimte"}];

export default function FloorPlans() {
    const [active, setActive] = useState(0);

    return (
        <div className="flex flex-col gap-4">
            <div
                className="flex items-center justify-center h-100 rounded-lg bg-(--color-white)
                    shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)]">
                <div className="text-[20px] font-semibold text-(--color-darkblue)">FloorPlans component komt hier</div>
            </div>

            <div className="flex flex-row gap-6">
                {floorPlans.map((plan, i) => (
                    <Button
                        key={plan.label}
                        icon={<img src={IconProduct} />}
                        label={plan.label}
                        active={active === i}
                        onClick={() => setActive(i)}
                    />
                ))}
            </div>
        </div>
    );
}
