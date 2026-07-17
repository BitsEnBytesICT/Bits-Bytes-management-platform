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

describe("account", () => {
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

    //TODO: add tests for account validator
})