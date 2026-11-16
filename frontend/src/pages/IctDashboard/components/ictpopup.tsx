import PopUp from "../../../common/components/PopUp";
import Button from "../../../common/components/Button";

const dummyData = [
    {
        id: "1",
        hostname: "Server 1",
        ipAdres: "128.0.0.1",
        version: "windows 98",
        schijfruimte: "45/100 GB (45%)",
        onlineStatus: 1,
    },
    {
        id: "2",
        hostname: "Server 2",
        ipAdres: "128.0.0.2",
        version: "windows 95",
        schijfruimte: "22/100 GB (45%)",
        onlineStatus: 0,
    },
];

export default function IctPopUp({setIsAddVmShown, onClose}) {
    const error: string[] = [""];
    
    return (
        <>
            <PopUp
                onClose={onClose}
                title={"Virtual Machine Toevoegen"}
                errors={error}
                children={[
                    <div key="all-servers" className="flex flex-col gap-[10px]">
                        <h1>Bob de Bouwer is hier bezig!</h1>
                    </div>
                ]}
                button={<Button onClick={() => setIsAddVmShown(true)}>Volgende</Button>}
            />
        </>
    );
}

