import type IFilter from "../../types/compontents/IFilter";

export default function Filter({filters, search}: IFilter) {
    function resetFilters() {
        filters.forEach(filter => filter.onChange(""));
        search?.onChange("");
    }

    return (
        <div
            className="py-2 px-4 flex flex-row gap-5 w-full text-[14px] font-semibold text-(--color-darkblue) rounded-lg
                shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)] bg-(--color-white)">
            {search && (
                <input
                    type="text"
                    value={search.value}
                    onChange={event => search.onChange(event.target.value)}
                    placeholder={search.placeholder ?? "Zoek"}
                    className="flex-1 min-w-0 bg-transparent outline-none placeholder:text-(--color-darkblue)/50"
                />
            )}

            {filters.map(filter => (
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
            ))}

            <button onClick={resetFilters} className="ml-auto text-(--color-darkblue) cursor-pointer">
                Reset
            </button>
        </div>
    );
}
