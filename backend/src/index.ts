import express, { Express, Request, Response } from 'express';
import { AddressInfo } from "net";
import UserRouter from './endpoints/example/user.routes';

const app: Express = express();
app.use(express.json({ limit: "5kb" }));
app.use(express.urlencoded({ extended: true, limit: "5kb" }));
app.set('port', process.env.PORT || 3000);

app.use(UserRouter);

const server = app.listen(app.get('port'), function () {
    console.log(`Express server listening on port ${(server.address() as AddressInfo).port}`);
});