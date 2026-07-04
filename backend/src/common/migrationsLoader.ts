import { load } from "migrate";
import type { MigrationSet } from "migrate";
import { dbGet, dbQuery, managementDB } from "./db";

class MySqlMigrationStore {
    
    private async createTable(): Promise<void> {
        if (process.env.DATABASE_TYPE === "sqllite") {
        await dbQuery(`
            CREATE TABLE IF NOT EXISTS migration_state (
                id INTEGER PRIMARY KEY,
                last_run TEXT NULL,
                migrations TEXT NOT NULL
            )
        `);
        }
        else {
        await managementDB.execute(`
            CREATE TABLE IF NOT EXISTS migration_state (
                id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
                last_run VARCHAR(255) NULL,
                migrations LONGTEXT NOT NULL
            )
        `);
        }
    }

    load(callback: any): void {
        void (async () => {
            await this.createTable();

            let rows: any[];
            const result = await dbGet<any>(`
                SELECT last_run, migrations
                FROM migration_state
                WHERE id = ?
            `, [1]);
            if (process.env.DATABASE_TYPE === "sqllite") rows = [result];
            else rows = result

            const row = rows?.[0];

            if (!row) {
                callback(null, {
                    lastRun: null,
                    migrations: [],
                });

                return;
            }

            callback(null, {
                lastRun: row.last_run ?? null,
                migrations: JSON.parse(
                    rows[0].migrations,
                ),
            });
        })().catch((error: unknown) => {
            callback(error);
        });
    }

    save(set: MigrationSet, callback: any): void {
        void (async () => {
            await this.createTable();

            const migrations =
                set.migrations.map((migration) => ({
                    title: migration.title,
                    description: migration.description,
                    timestamp: migration.timestamp,
                }));

            if (process.env.DATABASE_TYPE === "sqllite") {
                await dbQuery(`
                    INSERT INTO migration_state (
                        id,
                        last_run,
                        migrations
                    )
                    VALUES (?, ?, ?)
                    ON CONFLICT(id) DO UPDATE SET
                        last_run = excluded.last_run,
                        migrations = excluded.migrations;`,
                        [1,set.lastRun, JSON.stringify(migrations)]
                );
            }
            else {
                await managementDB.execute(
                    `
                        INSERT INTO migration_state (
                            id,
                            last_run,
                            migrations
                        )
                        VALUES (1, ?, ?)
                        ON DUPLICATE KEY UPDATE
                            last_run = VALUES(last_run),
                            migrations = VALUES(migrations)
                    `,
                    [
                        set.lastRun,
                        JSON.stringify(migrations),
                    ],
                );
            }

            callback(null);
        })().catch((error: unknown) => {
            callback(error);
        });
    }
}

export function runMigrations(): Promise<void> {
    return new Promise((resolve, reject) => {
        load(
            {
                migrationsDirectory: process.env.DATABASE_TYPE === "sqllite" ? "./migrationsDev" : "/usr/backend/migrations",
                stateStore: new MySqlMigrationStore(),
            },
            (loadError, migrationSet) => {
                if (loadError) {
                    reject(loadError);
                    return;
                }

                migrationSet.up((migrationError) => {
                    if (migrationError) {
                        reject(migrationError);
                        return;
                    }

                    resolve();
                });
            },
        );
    });
}