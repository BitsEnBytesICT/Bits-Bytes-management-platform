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
                        {dummyData.map((server) => {
                            const isPresent = server.onlineStatus === 1;
                            const presenceColor = isPresent ? "text-(--color-green)" : "text-(--color-red)";

                            return (
                                <div>
                                    <div key={server.id} className="flex justify-between px-10 items-center">
                                        <h2>{server.hostname}</h2>
                                        <h2>{server.ipAdres}</h2>
                                        <h2>{server.version}</h2>
                                        <div className={`font-semibold ${presenceColor}`}>
                                            {isPresent ? "Online" : "Offline"}
                                        </div>
                                        <div className="w-16 h-8 justify-between items-center flex text-center">
                                            <div className="w-6 h-6 border border-black">E</div>
                                            <div className="w-6 h-6 border border-black">X</div>
                                        </div>
                                    </div>
                                    
                                </div>
                            );
                        })}
                    </div>
                ]}
                button={<Button onClick={() => setIsAddVmShown(true)}>Volgende</Button>}
            />
        </>
    );
}

