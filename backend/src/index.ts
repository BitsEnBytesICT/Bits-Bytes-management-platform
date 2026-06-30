import express, { Express, NextFunction, Request, Response } from 'express';
import { AddressInfo } from "net";
import cors from "cors";
import { ErrorCodes } from './types/error/ErrorCodes';
import IError from './types/error/IError';
import { assertNever } from './common/Validator';
import HealthRouter from './endpoints/health/health.routes';
import attendanceRouter from './endpoints/attendances/attendance.routes';
import { setupDatabase } from './setupDatabases';
import { createConnection } from './common/db';
import { environmentFileChecker } from './common/environmentFileChecker';

environmentFileChecker();

if (process.env.DATABASE_TYPE === "sqllite") setupDatabase();
else if (process.env.DATABASE_TYPE === "mysql") createConnection();

console.log(process.env.BACKEND_SNAPSHOT_VERSION)

const app: Express = express();

app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [`http://localhost:5173`];
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
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
app.set('port', process.env.PORT || 3000);

app.use(HealthRouter);
app.use(attendanceRouter);

app.use((err: IError[], req: Request, res: Response, next: NextFunction) => {
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
            case ErrorCodes.sqlError:
                responseData.push(error.errorMSG.message);
                res.status(500);
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

//small change to test the bump version test5