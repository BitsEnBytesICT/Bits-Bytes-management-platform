export default interface IVirtualMachine {
    id: number;
    hostname: string;
    ipAddress: string;
    operatingSystem: string;
    online: boolean;
    storageUsed: number;
    storageTotal: number;
}
