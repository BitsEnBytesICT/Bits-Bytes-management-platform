import { get } from "node:https";
import serviceBase from "../../common/serviceBase";
import { KeyValuePair } from "../../common/Validator";
import { ErrorCodes } from "../../types/error/ErrorCodes";
import IError from "../../types/error/IError";
import AccountDAO from "./proxmox.dao";

export default class PRoxmoxService implements serviceBase<any> {
    dao: AccountDAO;

    constructor() {
        this.dao = new AccountDAO();
    }

    async findOne(...where: KeyValuePair<any>[]): Promise<any | undefined> {
        throw new Error('Method not implemented.');
    }

    async create(account: any) {
        throw new Error('Method not implemented.');
    }

    async update(where: KeyValuePair<any>, ...args: KeyValuePair<any>[]) {
        throw new Error('Method not implemented.');
    }

    async delete(id: number) {
        throw new Error('Method not implemented.');
    }

    async list(): Promise<any[]> {
        // Vul deze gegevens handmatig in voor de verbindingstest.
        const proxmoxUrl = "https://10.10.1.2:8006";
        const tokenId = "root@pam!management"; // gebruiker@realm!tokennaam
        const tokenSecret = "0d7f9804-e2bf-40e9-9db8-2335048a3f13";
        // Alleen bij een lokaal testcertificaat eventueel op false zetten.
        const verifyCertificate = false;

        // type=vm haalt zowel QEMU-VM's als LXC-containers op, over alle nodes.
        const url = new URL("/api2/json/cluster/resources?type=vm", proxmoxUrl);

        return new Promise<any[]>((resolve, reject) => {
            const request = get(url, {
                headers: {
                    Authorization: `PVEAPIToken=${tokenId}=${tokenSecret}`,
                    Accept: "application/json",
                },
                rejectUnauthorized: verifyCertificate,
                timeout: 10_000,
            }, (response) => {
                response.on("error", reject);

                if (!response.statusCode || response.statusCode < 200 || response.statusCode >= 300) {
                    response.resume();
                    reject(new Error(`Proxmox API: HTTP ${response.statusCode} ${response.statusMessage ?? ""}`));
                    return;
                }

                let body = "";
                response.setEncoding("utf8");
                response.on("data", (chunk: string) => body += chunk);
                response.on("end", () => {
                    try {
                        const result = JSON.parse(body);
                        if (!Array.isArray(result?.data)) {
                            throw new Error("Proxmox heeft geen geldige lijst teruggegeven.");
                        }

                        // Elk item bevat o.a. vmid, name, node, status en type (qemu/lxc).
                        resolve(result.data);
                    } catch (error) {
                        reject(error);
                    }
                });
            });

            request.on("timeout", () => {
                request.destroy(new Error("De verbinding met Proxmox heeft een timeout bereikt."));
            });
            request.on("error", reject);
        }).catch((error: unknown) => {
            // Sluit aan op de bestaande foutafhandeling van de backend.
            throw {
                date: new Date(),
                errorMSG: error instanceof Error ? error : new Error(String(error)),
                code: ErrorCodes.Unknown,
            } satisfies IError;
        });
    }
}
