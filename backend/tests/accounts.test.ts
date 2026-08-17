import { before, describe, it } from "node:test";
import { setupDatabase } from "../src/setupDatabases";
import assert from "node:assert/strict";
import { runMigrations } from "../src/common/migrationsLoader";
import { encrypt } from "../src/common/encryptorDecryptor";
import jwt from "jsonwebtoken";
import AccountService from "../src/endpoints/accounts/accounts.service";
import IAccount from "../src/types/accounts/IAccount";
import { PermissionsList } from "../src/types/accounts/accountTypes";
import { Roles } from "../src/types/permissions/rolesList";
import { AccountValidator } from "../src/validators/accountValidator";

describe("AccountService", () => {
    const service = new AccountService();

    before(async () => {
        process.env.NODE_ENV = "DEVELOPMENT";
        process.env.DATABASE_TYPE = "sqllite";
        process.env.JWT_SECRET = "VERYSECURESECRET";
        process.env.ENCRYPTION_KEY = "b6424bcf211217cc99e17c27f1d36dafbe6ab3db75c65b3a10c3ab8162d1e2cd";

        try {
            await runMigrations();
        } catch {}
        try {
            setupDatabase();
        } catch {}
    });

    it("get account from token", async () => {
        const token = jwt.sign(
            { username: encrypt("support") },
            String(process.env.JWT_SECRET),
            { expiresIn: 900 },
        );

        assert.ok(await service.current(token));
    });

    it("create new account", async () => {
        const account: IAccount = {
            type: PermissionsList.participant,
            firstname: "Chris",
            lastname: "Redfield",
            username: "ChirsR",
            role: Roles.admin,
            password: encrypt("test123")
        }

        await assert.doesNotReject(async () => {
            await service.create(account);
        });
    });

    it("find account", async () => {
        const account = await service.findOne(["firstname", "Chris"], ["lastname", "Redfield"]);

        assert.ok(account);
    });

    it("update account", async () => {
        await assert.doesNotReject(async () => {
            await service.update(
                ["username", "ChirsR"],
                ["firstname", "ChrisUpdated"],
                ["lastname", "RedfieldUpdated"],
                ["password", "newPassword"],
            );
        });

        const updatedAccount = await service.findOne(["username", "ChirsR"]);

        assert.equal(updatedAccount?.firstname, "ChrisUpdated");
        assert.equal(updatedAccount?.lastname, "RedfieldUpdated");
        assert.equal(updatedAccount?.password, "newPassword");
    });
});

describe("AccountValidator", () => {
    const validAccount: IAccount = {
        id: 1,
        type: PermissionsList.participant,
        firstname: "Chris",
        lastname: "Redfield",
        username: "ChrisR",
        role: Roles.admin,
        password: "test123",
    };

    it("accepts a fully valid account", () => {
        const results = AccountValidator(validAccount);

        assert.ok(results.every((result) => result.kind === "success"));
    });

    it("rejects empty and invalid values", () => {
        const results = AccountValidator({
            id: -1,
            type: "invalid" as PermissionsList,
            firstname: "",
            lastname: "",
            username: "",
            role: "invalid" as Roles,
            password: "",
        });

        assert.ok(results.every((result) => result.kind === "error"));
    });

    it("accepts an account without the optional id", () => {
        const { id, ...accountWithoutId } = validAccount;
        const results = AccountValidator(accountWithoutId as IAccount);

        assert.ok(results.every((result) => result.kind === "success"));
    });

    it("accepts an id of exactly 0 but rejects a negative id", () => {
        const zeroIdResults = AccountValidator({ ...validAccount, id: 0 });
        const negativeIdResults = AccountValidator({ ...validAccount, id: -1 });

        assert.equal(zeroIdResults.find((result) => result.key === "id")?.kind, "success");
        assert.equal(negativeIdResults.find((result) => result.key === "id")?.kind, "error");
    });

    it("accepts strings of exactly 50 characters but rejects 51", () => {
        const fiftyChars = "a".repeat(50);
        const fiftyOneChars = "a".repeat(51);

        for (const key of ["firstname", "lastname", "username"] as const) {
            const validResults = AccountValidator({ ...validAccount, [key]: fiftyChars });
            const invalidResults = AccountValidator({ ...validAccount, [key]: fiftyOneChars });

            assert.equal(validResults.find((result) => result.key === key)?.kind, "success");
            assert.equal(invalidResults.find((result) => result.key === key)?.kind, "error");
        }
    });

    it("rejects values outside PermissionsList and Roles", () => {
        const results = AccountValidator({
            ...validAccount,
            type: "invalid" as PermissionsList,
            role: "invalid" as Roles,
        });

        assert.equal(results.find((result) => result.key === "type")?.kind, "error");
        assert.equal(results.find((result) => result.key === "role")?.kind, "error");
    });
});
