import PopUp from "../../../common/components/PopUp";
import Button from "../../../common/components/Button";
import Input from "../../../common/components/Input";
import {useState} from "react";

// const dummyData = [
//     {
//         id: "1",
//         hostname: "Server 1",
//         ipAdres: "128.0.0.1",
//         version: "windows 98",
//         schijfruimte: "45/100 GB (45%)",
//         onlineStatus: 1,
//     },
//     {
//         id: "2",
//         hostname: "Server 2",
//         ipAdres: "128.0.0.2",
//         version: "windows 95",
//         schijfruimteTotal: "22/100 GB (45%)",
//         onlineStatus: 0,
//     },
// ];

export default function IctPopUp({setIsAddVmShown, onClose, server}) {
    const error: string[] = [""];
    const [currentServer, setCurrentServer] = useState(server);

    return (
        <>
            <PopUp
                onClose={onClose}
                title={"Virtual Machine Toevoegen"}
                errors={error}
                children={[
                    <div key="all-servers" className="grid grid-cols-2 gap-x-6 gap-t-4">
                        <Input
                            label="Hostname"
                            placeholder="Host name"
                            id="hostname"
                            type="text"
                            value={currentServer?.hostname}
                            readOnly={false}
                            required={false}
                            onChange={(value: string) => setCurrentServer({...currentServer, hostname: value})}
                        />
                        <Input
                            label="IP Adres"
                            placeholder="Format: xxx.x.x.x"
                            id="ipAdres"
                            type="text"
                            value={currentServer?.ipAdres}
                            readOnly={false}
                            required={false}
                            onChange={(value: string) => setCurrentServer({...currentServer, ipAdres: value})}
                        />
                        <Input
                            label="Operating System"
                            placeholder="lijstje maybe?"
                            id="version"
                            type="text"
                            value={currentServer?.version}
                            readOnly={false}
                            required={false}
                            onChange={(value: string) => setCurrentServer({...currentServer, version: value})}
                        />
                        <Input
                            label="Storage space totaal"
                            placeholder="textbox follow by choice of gb/tb or auto detect?"
                            id="schijfruimteTotaal"
                            type="text"
                            value={currentServer?.schijfruimteTotaal}
                            readOnly={false}
                            required={false}
                            onChange={(value: string) =>
                                setCurrentServer({...currentServer, schijfruimteTotaal: value})
                            }
                        />
                    </div>,
                ]}
                button={<Button onClick={() => setIsAddVmShown(true)}>Volgende</Button>}
            />
        </>
    );
}
