const express = require('express');
const dotenv = require('dotenv');
const app = express();
const cron = require('node-cron');
dotenv.config();
import { createConnection } from "typeorm";
import { ExchangeController } from "./controllers/exchangeController";
const exchangeController = new ExchangeController;

createConnection().then(async(connection) => {
    // await exchangeController.initialSync();
    // CRON TIME in minutes
    cron.schedule(`*/${process.env.CRON_TIME} * * * *`, () => {
        exchangeController.initialSync();
        console.log(`running a task in every ${process.env.CRON_TIME} minute`, new Date(Date.now()));
    });

    app.get('/', exchangeController.validateRequest, async (req, res) => {
        try{
            let data = await exchangeController.getCurrency(req, res);
            res.json(data);
        } catch(e){
            console.log(e);
            res.end();
        }
    });

    app.listen(process.env.PORT, function () {
        console.log(`App is listening on port ${process.env.PORT}`);
    });
});