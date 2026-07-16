import type IFilter from "../../types/compontents/IFilter";
import type {IFilterOption} from "../../types/compontents/IFilter";

export default function Filter({filters}: IFilter) {
    function renderFilter(filter: IFilterOption) {
        return (
            <label key={filter.label} className="flex flex-row gap-px items-center size-fit cursor-pointer">
                <span className="size-fit text-(--color-darkblue)/50">{filter.label}:</span>

                <select
                    onChange={event => filter.onChange(event.target.value)}
                    value={filter.value}
                    className="w-12.5 truncate bg-transparent outline-none cursor-pointer">
                    <option value="">Alle</option>

                    {filter.options.map(option => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </label>
        );
    }

    function resetFilters() {
        filters.forEach(filter => filter.onChange(""));
    }

    return (
        <div
            className="py-2 px-4 flex flex-row gap-5 w-full text-[14px] font-semibold text-(--color-darkblue) rounded-lg
                shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)] bg-(--color-white)">
            {filters.map(renderFilter)}

            <button onClick={resetFilters} className="ml-auto text-(--color-darkblue) cursor-pointer">
                Reset
            </button>
        </div>
    );
}
