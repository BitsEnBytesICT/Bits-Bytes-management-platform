interface CategorySelectProps {
    categories: string[];
    value: string;
    onChange: (value: string) => void;
}

export const ALL_CATEGORIES = "all";

export default function CategorySelect({categories, value, onChange}: CategorySelectProps) {
    return (
        <div className="relative inline-flex">
            <select
                value={value}
                onChange={e => onChange(e.target.value)}
                className="h-9 cursor-pointer appearance-none rounded-md border border-gray-300 bg-white py-1.5 pl-3
                    pr-9 text-sm text-gray-700 shadow-sm transition hover:border-gray-400 focus:border-gray-900
                    focus:outline-none focus:ring-2 focus:ring-gray-900/10">
                <option value={ALL_CATEGORIES}>Alle categorieën</option>
                {categories.map(category => (
                    <option key={category} value={category}>
                        {category}
                    </option>
                ))}
            </select>

            <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500">
                <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                />
            </svg>
        </div>
    );
}
