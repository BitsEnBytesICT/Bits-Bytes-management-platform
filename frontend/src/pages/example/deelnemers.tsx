import {useState} from "react";
import DeelnemersService from "./deelnemers.service";

export default function Deelnemers() {
    const [data, setData] = useState<string[]>([]);

    const service: DeelnemersService = new DeelnemersService();

    async function testBackend() {
        setData(await service.testBackend());
    }

    return (
        <>
            <div className="flex flex-col items-start">
                <span>Deelnemers</span>
                <button className="cursor-pointer" onClick={testBackend}>
                    test backend
                </button>
                {data.map(item => (
                    <span>{item}</span>
                ))}
            </div>
        </>
    );
}
