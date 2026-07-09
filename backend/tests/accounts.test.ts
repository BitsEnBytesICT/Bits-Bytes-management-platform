import { before, describe, it } from "node:test";
import { setupDatabase } from "../src/setupDatabases";
import assert from "node:assert/strict";
import { runMigrations } from "../src/common/migrationsLoader";
import { encrypt } from "../src/common/encryptorDecryptor";
import jwt from "jsonwebtoken";
import AccountService from "../src/endpoints/accounts/accounts.service";

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

        assert.ok(service.current(token));
    });

    //TODO: add tests for account validator
})