import type IIcon from "../../types/compontents/IIcon";

export default function Icon({src, classNameExtra}: IIcon) {
    return (
        <span
            aria-hidden="true"
            style={{maskImage: `url("${src}")`}}
            className={`inline-block size-5 shrink-0 bg-(--color-darkblue) [mask-size:contain] [mask-repeat:no-repeat]
                [mask-position:center] ${classNameExtra ?? ""}`}
        />
    );
}
