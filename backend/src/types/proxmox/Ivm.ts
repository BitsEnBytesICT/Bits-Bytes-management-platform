export default interface Ivm {
    memhost: number;
    maxmem: number;
    diskread: number;
    name: string;
    mem: number;
    disk: number;
    uptime: number;
    maxdisk: number;
    node: string;
    maxcpu: number;
    diskwrite: number;
    netin: number;
    type: "qemu" | "lxc";
    id: string;
    status: string;
    vmid: number;
    netout: number;
    cpu: number;
    template: 0 | 1;
}
