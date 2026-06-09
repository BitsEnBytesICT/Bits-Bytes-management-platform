import express, { Express, NextFunction, Request, Response } from 'express';
import { AddressInfo } from "net";
import UserRouter from './endpoints/example/user.routes';
import cors from "cors";
import IError from './types/error/IError';
import { ErrorCodes } from './types/error/ErrorCodes';
import { assertNever } from './common/Validator';

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

app.use(express.json({ limit: "5kb" }));
app.use(express.urlencoded({ extended: true, limit: "5kb" }));
app.set('port', process.env.PORT || 3000);

app.use(UserRouter);

app.use((err: IError[], req: Request, res: Response, next: NextFunction) => {
    console.log(err)
    let responseData = [];
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
                assertNever(error.code);
                continue;
        }
    }

    res.json(responseData);
});

const server = app.listen(app.get('port'), function () {
    console.log(`Express server listening on port ${(server.address() as AddressInfo).port}`);
});