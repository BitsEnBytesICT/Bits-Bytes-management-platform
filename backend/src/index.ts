import express, { Express, NextFunction, Request, Response } from 'express';
import { AddressInfo } from "net";
import cors from "cors";
import { ErrorCodes } from './types/error/ErrorCodes';
import UserRouter from './endpoints/example/user.routes';
import HealthRouter from './endpoints/health/health.routes';
import ScanRouter from './endpoints/scan/scan.routes';
import './setupDatabases';

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
    withCredentials: true,
    credentials: true,
}));

app.use(express.json({ limit: "200kb" }));
app.use(express.urlencoded({ extended: true, limit: "200kb" }));
app.set('port', process.env.PORT || 3000);

app.use(HealthRouter);
app.use(ScanRouter);
app.use(UserRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    if (Array.isArray(err)) {
        let responseData: string[] = [];
        for (const error of err) {
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
                    continue;
            }
        }
        res.json(responseData);
    } else {
        res.status(500).json({ success: false, message: err?.message || 'Internal server error' });
    }
});

const server = app.listen(app.get('port'), function () {
    console.log(`Express server listening on port ${(server.address() as AddressInfo).port}`);
});
