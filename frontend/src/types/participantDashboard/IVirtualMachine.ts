export default interface IVirtualMachine {
    id: string;
    hostname: string;
    ipAddress: string;
    operatingSystem: string;
    status: "online" | "offline";
    usedStorage: number;
    totalStorage: number;
}
