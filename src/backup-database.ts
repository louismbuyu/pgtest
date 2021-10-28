import { execute } from '@getvim/execute';
import cron from 'node-cron';

import dotenv from 'dotenv';
dotenv.config();

const username = process.env.DB_USER;
const database = process.env.DB_NAME;
const date = new Date();

const currentDate = `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}.${date.getHours()}.${date.getMinutes()}`;
// this can be a path if you don't want it saved in your current folder.
// eg. const path = require('path')
//const file = path.join('./src', fileName)
const fileName = `database-backup-${currentDate}.tar`;
const fileNameGzip = `${fileName}.tar.gz`;

export const backup = async () => {
    try {
        await execute(`pg_dump -U ${username} -d ${database} -f ${fileName} -F t`);
        console.log("Finito");
    } catch (err) {
        console.log(err);
    }
}

export const backup2 = () => {
    const ex = `pg_dump -U ${username} -p 5432 -w -F t -d ${database} -f ${fileName} -F t`;
    const ex2 = `pg_dump -U ${username} -d ${database} -f ${fileName} -F t`;
    execute(
        ex,
    ).then(async ()=> {
        console.log("Finito");
    }).catch(err=> {
        console.log("error: ",err);
    })
}

export const restore = async () => {
    try {
        await execute(`pg_restore -cC -d ${database} ${fileNameGzip}`);
        console.log("Restored");
    } catch (err) {
        console.log(err);
    }
}

export const startSchedule = () => {
    cron.schedule('0 */2 * * *', () => {
        backup().then();
    }, {});
}