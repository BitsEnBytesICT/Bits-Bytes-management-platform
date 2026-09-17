import express, { Express, NextFunction, Request, Response } from 'express';
import { AddressInfo } from "net";
import cors from "cors";
import { ErrorCodes } from './types/error/ErrorCodes';
import IError from './types/error/IError';
import { assertNever } from './common/Validator';
import HealthRouter from './endpoints/health/health.routes';
import attendanceRouter from './endpoints/attendances/attendance.routes';
import authRouter from './endpoints/auth/auth.routes';
import participantRouter from './endpoints/participants/participants.routes';
import AccountRouter from './endpoints/accounts/accounts.routes';
import roomRouter from './endpoints/rooms/rooms.routes';
import wallRouter from './endpoints/walls/walls.routes';
import workplaceRouter from './endpoints/workplaces/workplaces.routes';
import { setupDatabase } from './setupDatabases';
import { createConnection } from './common/db';
import { environmentFileChecker } from './common/environmentFileChecker';
import { runMigrations } from './common/migrationsLoader';
import { createEnforcer } from './common/casbin';
import cookieParser from 'cookie-parser';

environmentFileChecker();

const prepareDB = async() => {
    if (process.env.DATABASE_TYPE === "sqllite"){
        try {
            await runMigrations();
            setupDatabase();
        } catch (error) {
            console.log(error);
        }
    } 
    else if (process.env.DATABASE_TYPE === "mysql") await createConnection();
}
prepareDB().then(createEnforcer);

const app: Express = express();

app.set("trust proxy", 2);

app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigin = process.env.ALLOWED_ORIGIN;
        if (!origin || allowedOrigin === "*" || origin === allowedOrigin) {
            console.log(`allowed connection from origin: ${origin}`);
            callback(null, true);
        } else {
            console.log(`Blocked CORS request from origin: ${origin}`);
            callback(null, false);
        }
    },
    credentials: true,
}));

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(cookieParser());
app.set('port', process.env.PORT || 3000);

app.use(HealthRouter);
app.use(attendanceRouter);
app.use(authRouter);
app.use(participantRouter);
app.use(AccountRouter);
app.use(roomRouter);
app.use(wallRouter);
app.use(workplaceRouter);

app.use((err: IError[] | IError, req: Request, res: Response, next: NextFunction) => {
    console.log(err)
    const errorData = Array.isArray(err) ? err : [err]
    let responseData = [];
    for (const error of errorData) {
        switch (error.code) {
            case ErrorCodes.InvalidData:
                responseData.push(error.errorMSG.message);
                res.status(422);
                continue;
            case ErrorCodes.Unknown:
                responseData.push(error.errorMSG.message);
                res.status(500);
                continue;
            case undefined:
                res.status(500);
                continue;
            case ErrorCodes.sqlError:
                responseData.push(error.errorMSG.message);
                res.status(500);
                continue;
            case ErrorCodes.invalidCredentials:
                responseData.push(error.errorMSG.message);
                res.status(401);
                continue;
            default:
                assertNever(error.code);
                continue;
        }
    }
    res.json(responseData);
});

const server = app.listen(app.get('port'), function () {
    console.log(`Express server version ${
        process.env.BACKEND_SNAPSHOT_VERSION && Number(process.env.BACKEND_SNAPSHOT_VERSION) > 0 ? 
        `${process.env.BACKEND_VERSION}-snapshot-${process.env.BACKEND_SNAPSHOT_VERSION}` : 
        process.env.BACKEND_VERSION} listening on port ${(server.address() as AddressInfo).port}`);
});
