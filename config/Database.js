import { Sequelize } from "sequelize";

// const db = new Sequelize('heroku_93baa933e9d41b5', 'b73eb35faec2aa', '1da236ba', {
//     host:'us-cdbr-east-04.cleardb.com',
//     dialect:'mysql',
//     timezone: '+07:00'
// });
const db = new Sequelize('auth-waapi', 'root', '', {
    host:'localhost',
    dialect:'mysql',
    timezone: '+07:00'
});

export default db;