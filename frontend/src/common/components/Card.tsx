interface CardProps {
    title: string;
    value: string | number;
    className?: string;
}

export default function Card({title, value}: CardProps) {
    return (
        <div className="">
            <div className="">{title}</div>
            <div className="">{value}</div>
        </div>
    );
}
