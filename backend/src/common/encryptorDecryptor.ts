import * as crypto from "crypto";

export const encrypt = <Input>(data: Input) => {
    const ivByteLength = 12;
    const initializationVector = crypto.randomBytes(ivByteLength);
    const cipher = crypto.createCipheriv("aes-256-gcm", Buffer.from(String(process.env.ENCRYPTION_KEY), "hex"), initializationVector);
    const encrypted = Buffer.concat([cipher.update(JSON.stringify(data), "utf8"), cipher.final()]);
    const tag = cipher.getAuthTag();
    return [initializationVector, tag, encrypted].map((b) => b.toString("hex")).join(":");
};

export const decrypt = <Output>(data: string): Output => {
    if (!data || data.split(":").length !== 3) {
        return data as unknown as Output;
    }
    const [initializationVector, tag, encrypted] = data.split(":");
    const decipher = crypto.createDecipheriv(
        "aes-256-gcm",
        Buffer.from(String(process.env.ENCRYPTION_KEY), "hex"),
        Buffer.from(String(initializationVector), "hex"),
    ).setAuthTag(Buffer.from(String(tag), "hex"));

    return JSON.parse(decipher.update(Buffer.from(String(encrypted), "hex")) + decipher.final("utf8")) as Output;
};