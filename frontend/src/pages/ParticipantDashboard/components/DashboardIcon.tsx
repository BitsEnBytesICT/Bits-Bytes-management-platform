export default function DashboardIcon({src}: {src: string}) {
    return (
        <span
            aria-hidden="true"
            className="block h-5 w-5 shrink-0 bg-(--color-darkblue) mask-contain mask-center mask-no-repeat"
            style={{maskImage: `url("${src}")`}}
        />
    );
}
