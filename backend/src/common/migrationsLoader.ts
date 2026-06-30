import path from "node:path";
import { load } from "migrate";
import type { MigrationSet } from "migrate";
import { dbQuery, managementDB } from "./db";

class MySqlMigrationStore {
    
    private async createTable(): Promise<void> {
        await managementDB.execute(`
            CREATE TABLE IF NOT EXISTS migration_state (
                id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
                last_run VARCHAR(255) NULL,
                migrations LONGTEXT NOT NULL
            )
        `);
    }

    load(callback: any): void {
        void (async () => {
            await this.createTable();

            const [rows]: any[] = await dbQuery(`
                SELECT last_run, migrations
                FROM migration_state
                WHERE id = 1
            `);

            if (!rows || !rows[0].last_run || rows.length === 0) {
                callback(null, {
                    lastRun: null,
                    migrations: [],
                });

                return;
            }

            callback(null, {
                lastRun: rows[0].last_run,
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
                migrationsDirectory: "/usr/backend/migrations",
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