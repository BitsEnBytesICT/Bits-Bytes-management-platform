import { before, describe, it } from "node:test";
import AuthService from "../src/endpoints/auth/auth.service";
import { setupDatabase } from "../src/setupDatabases";
import assert from "node:assert/strict";
import { runMigrations } from "../src/common/migrationsLoader";
import { encrypt } from "../src/common/encryptorDecryptor";
import jwt from "jsonwebtoken";

describe("login", () => {
    const service = new AuthService();

    before(async () => {
        try {
            await runMigrations();
            setupDatabase();
        } catch (error) {
            
        }

        process.env.NODE_ENV = "DEVELOPMENT";
        process.env.DATABASE_TYPE = "sqllite";
        process.env.JWT_SECRET = "VERYSECURESECRET";
        process.env.ENCRYPTION_KEY = "b6424bcf211217cc99e17c27f1d36dafbe6ab3db75c65b3a10c3ab8162d1e2cd";
    });

    it("login with username and password", async () => {
        console.log(process.env.DATABASE_TYPE)
        console.log(process.env.JWT_SECRET)
        assert.ok(await service.login("admin", "test123"));
    });

    it("login with username and password and verify token", async () => {
        const token = jwt.sign(
            { username: encrypt("admin") },
            String(process.env.JWT_SECRET),
            { expiresIn: 900 },
        );
        await assert.doesNotReject(async () => {
            await service.verify(token);
        });
    });

    it("login with username and password and refresh token", async () => {
        const token = jwt.sign(
            { username: encrypt("admin") },
            String(process.env.JWT_SECRET),
            { expiresIn: -1 },
        );
        assert.ok(await service.refresh(token));
    });
})