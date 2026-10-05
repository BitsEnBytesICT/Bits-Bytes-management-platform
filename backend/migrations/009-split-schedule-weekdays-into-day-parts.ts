import { dbGet, dbQuery } from "../src/common/db";

export async function up(): Promise<void> {
    // A single participant column cannot preserve links to multiple participants.
    const [sharedSchedule] = await dbGet<{ scheduleId: number }>(`
        SELECT scheduleId
        FROM SchedulesParticipants
        GROUP BY scheduleId
        HAVING COUNT(DISTINCT participantId) > 1
        LIMIT 1
    `);
    if (sharedSchedule) {
        throw new Error(`Cannot migrate schedule ${sharedSchedule.scheduleId}: it is linked to multiple participants`);
    }

    await dbQuery(`
        ALTER TABLE Schedules
        ADD COLUMN participant INT UNSIGNED NOT NULL,
        ADD COLUMN monMorning INT UNSIGNED NULL,
        ADD COLUMN monEvening INT UNSIGNED NULL,
        ADD COLUMN thuesMorning INT UNSIGNED NULL,
        ADD COLUMN thuesEvening INT UNSIGNED NULL,
        ADD COLUMN wedMorning INT UNSIGNED NULL,
        ADD COLUMN wedEvening INT UNSIGNED NULL,
        ADD COLUMN thursMorning INT UNSIGNED NULL,
        ADD COLUMN thursEvening INT UNSIGNED NULL,
        ADD COLUMN friMorning INT UNSIGNED NULL,
        ADD COLUMN friEvening INT UNSIGNED NULL,

        ADD KEY idx_schedules_participant (participant),
        ADD KEY idx_schedules_monMorning_workplace (monMorning),
        ADD KEY idx_schedules_monEvening_workplace (monEvening),
        ADD KEY idx_schedules_thuesMorning_workplace (thuesMorning),
        ADD KEY idx_schedules_thuesEvening_workplace (thuesEvening),
        ADD KEY idx_schedules_wedMorning_workplace (wedMorning),
        ADD KEY idx_schedules_wedEvening_workplace (wedEvening),
        ADD KEY idx_schedules_thursMorning_workplace (thursMorning),
        ADD KEY idx_schedules_thursEvening_workplace (thursEvening),
        ADD KEY idx_schedules_friMorning_workplace (friMorning),
        ADD KEY idx_schedules_friEvening_workplace (friEvening),

        ADD CONSTRAINT fk_schedules_participant
            FOREIGN KEY (participant) REFERENCES Participants(id),
        ADD CONSTRAINT fk_schedules_monMorning_workplace
            FOREIGN KEY (monMorning) REFERENCES Workplaces(id),
        ADD CONSTRAINT fk_schedules_monEvening_workplace
            FOREIGN KEY (monEvening) REFERENCES Workplaces(id),
        ADD CONSTRAINT fk_schedules_thuesMorning_workplace
            FOREIGN KEY (thuesMorning) REFERENCES Workplaces(id),
        ADD CONSTRAINT fk_schedules_thuesEvening_workplace
            FOREIGN KEY (thuesEvening) REFERENCES Workplaces(id),
        ADD CONSTRAINT fk_schedules_wedMorning_workplace
            FOREIGN KEY (wedMorning) REFERENCES Workplaces(id),
        ADD CONSTRAINT fk_schedules_wedEvening_workplace
            FOREIGN KEY (wedEvening) REFERENCES Workplaces(id),
        ADD CONSTRAINT fk_schedules_thursMorning_workplace
            FOREIGN KEY (thursMorning) REFERENCES Workplaces(id),
        ADD CONSTRAINT fk_schedules_thursEvening_workplace
            FOREIGN KEY (thursEvening) REFERENCES Workplaces(id),
        ADD CONSTRAINT fk_schedules_friMorning_workplace
            FOREIGN KEY (friMorning) REFERENCES Workplaces(id),
        ADD CONSTRAINT fk_schedules_friEvening_workplace
            FOREIGN KEY (friEvening) REFERENCES Workplaces(id)
    `);

    // Move participant links onto the schedule before dropping the junction table.
    await dbQuery(`
        UPDATE Schedules
        SET participant = (
            SELECT DISTINCT participantId
            FROM SchedulesParticipants
            WHERE scheduleId = Schedules.id
        )
    `);

    // Existing assignments cover the whole day, so preserve them in both day parts.
    await dbQuery(`
        UPDATE Schedules
        SET monMorning = mon,
            monEvening = mon,
            thuesMorning = thues,
            thuesEvening = thues,
            wedMorning = wed,
            wedEvening = wed,
            thursMorning = thurs,
            thursEvening = thurs,
            friMorning = fri,
            friEvening = fri
    `);

    await dbQuery(`
        ALTER TABLE Schedules
        DROP FOREIGN KEY fk_schedules_mon_workplace,
        DROP FOREIGN KEY fk_schedules_thues_workplace,
        DROP FOREIGN KEY fk_schedules_wed_workplace,
        DROP FOREIGN KEY fk_schedules_thurs_workplace,
        DROP FOREIGN KEY fk_schedules_fri_workplace,

        DROP INDEX idx_schedules_mon_workplace,
        DROP INDEX idx_schedules_thues_workplace,
        DROP INDEX idx_schedules_wed_workplace,
        DROP INDEX idx_schedules_thurs_workplace,
        DROP INDEX idx_schedules_fri_workplace,

        DROP COLUMN mon,
        DROP COLUMN thues,
        DROP COLUMN wed,
        DROP COLUMN thurs,
        DROP COLUMN fri
    `);

    await dbQuery("DROP TABLE SchedulesParticipants");
}

export async function down(): Promise<void> {
    await dbQuery(`
        CREATE TABLE SchedulesParticipants (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT,
            scheduleId INT UNSIGNED NOT NULL,
            participantId INT UNSIGNED NOT NULL,
            PRIMARY KEY (id),
            KEY idx_schedules_participant_schedule (scheduleId),
            KEY idx_schedules_participants_participant (participantId),
            CONSTRAINT fk_schedules_participants_schedule
                FOREIGN KEY (scheduleId) REFERENCES Schedules(id),
            CONSTRAINT fk_schedules_participants_participant
                FOREIGN KEY (participantId) REFERENCES Participants(id)
        ) ENGINE=InnoDB
          DEFAULT CHARSET=utf8mb4
          COLLATE=utf8mb4_unicode_ci
    `);

    // Restore participant links before removing the participant column.
    await dbQuery(`
        INSERT INTO SchedulesParticipants (scheduleId, participantId)
        SELECT id, participant
        FROM Schedules
        WHERE participant IS NOT NULL
    `);

    await dbQuery(`
        ALTER TABLE Schedules
        ADD COLUMN mon INT UNSIGNED NULL,
        ADD COLUMN thues INT UNSIGNED NULL,
        ADD COLUMN wed INT UNSIGNED NULL,
        ADD COLUMN thurs INT UNSIGNED NULL,
        ADD COLUMN fri INT UNSIGNED NULL,

        ADD KEY idx_schedules_mon_workplace (mon),
        ADD KEY idx_schedules_thues_workplace (thues),
        ADD KEY idx_schedules_wed_workplace (wed),
        ADD KEY idx_schedules_thurs_workplace (thurs),
        ADD KEY idx_schedules_fri_workplace (fri),

        ADD CONSTRAINT fk_schedules_mon_workplace
            FOREIGN KEY (mon) REFERENCES Workplaces(id),
        ADD CONSTRAINT fk_schedules_thues_workplace
            FOREIGN KEY (thues) REFERENCES Workplaces(id),
        ADD CONSTRAINT fk_schedules_wed_workplace
            FOREIGN KEY (wed) REFERENCES Workplaces(id),
        ADD CONSTRAINT fk_schedules_thurs_workplace
            FOREIGN KEY (thurs) REFERENCES Workplaces(id),
        ADD CONSTRAINT fk_schedules_fri_workplace
            FOREIGN KEY (fri) REFERENCES Workplaces(id)
    `);

    // The old schema can only keep one workplace per day; prefer morning, then evening.
    await dbQuery(`
        UPDATE Schedules
        SET mon = COALESCE(monMorning, monEvening),
            thues = COALESCE(thuesMorning, thuesEvening),
            wed = COALESCE(wedMorning, wedEvening),
            thurs = COALESCE(thursMorning, thursEvening),
            fri = COALESCE(friMorning, friEvening)
    `);

    await dbQuery(`
        ALTER TABLE Schedules
        DROP FOREIGN KEY fk_schedules_participant,
        DROP FOREIGN KEY fk_schedules_monMorning_workplace,
        DROP FOREIGN KEY fk_schedules_monEvening_workplace,
        DROP FOREIGN KEY fk_schedules_thuesMorning_workplace,
        DROP FOREIGN KEY fk_schedules_thuesEvening_workplace,
        DROP FOREIGN KEY fk_schedules_wedMorning_workplace,
        DROP FOREIGN KEY fk_schedules_wedEvening_workplace,
        DROP FOREIGN KEY fk_schedules_thursMorning_workplace,
        DROP FOREIGN KEY fk_schedules_thursEvening_workplace,
        DROP FOREIGN KEY fk_schedules_friMorning_workplace,
        DROP FOREIGN KEY fk_schedules_friEvening_workplace,

        DROP INDEX idx_schedules_participant,
        DROP INDEX idx_schedules_monMorning_workplace,
        DROP INDEX idx_schedules_monEvening_workplace,
        DROP INDEX idx_schedules_thuesMorning_workplace,
        DROP INDEX idx_schedules_thuesEvening_workplace,
        DROP INDEX idx_schedules_wedMorning_workplace,
        DROP INDEX idx_schedules_wedEvening_workplace,
        DROP INDEX idx_schedules_thursMorning_workplace,
        DROP INDEX idx_schedules_thursEvening_workplace,
        DROP INDEX idx_schedules_friMorning_workplace,
        DROP INDEX idx_schedules_friEvening_workplace,

        DROP COLUMN participant,
        DROP COLUMN monMorning,
        DROP COLUMN monEvening,
        DROP COLUMN thuesMorning,
        DROP COLUMN thuesEvening,
        DROP COLUMN wedMorning,
        DROP COLUMN wedEvening,
        DROP COLUMN thursMorning,
        DROP COLUMN thursEvening,
        DROP COLUMN friMorning,
        DROP COLUMN friEvening
    `);
}
