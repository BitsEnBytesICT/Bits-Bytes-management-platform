import http from "../../common/http";

export default class SignatureManagementService {
    updateSignature = async (id: number, signature: string): Promise<string[]> => {
        const response = await http("/api/attendance/update", "POST", {
            id: id,
            signature: signature,
        });
        if (response.status === 200) return;
        else return await response.json();
    };
}
