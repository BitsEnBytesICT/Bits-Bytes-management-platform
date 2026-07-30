import { dbQuery } from "../src/common/db";

export async function up(): Promise<void> {
    await dbQuery(`
        CREATE TABLE IF NOT EXISTS ApiKeys (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT,
            apikey VARCHAR(255) NOT NULL,
            permissionId INT UNSIGNED NOT NULL,
            PRIMARY KEY (id),
            UNIQUE KEY uq_apikeys_apikey (apikey),
            KEY idx_apikeys_permission (permissionId),
            CONSTRAINT fk_apikeys_permission
                FOREIGN KEY (permissionId)
                REFERENCES Permissions(id)
        ) ENGINE=InnoDB
          DEFAULT CHARSET=utf8mb4
          COLLATE=utf8mb4_unicode_ci
    `);
}

export async function down(): Promise<void> {
    await dbQuery("DROP TABLE IF EXISTS ApiKeys");
}
