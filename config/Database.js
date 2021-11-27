import { Sequelize } from "sequelize";

const db = new Sequelize('auth-waapi', 'root', '', {
    host:'localhost',
    dialect:'mysql',
    dialectOptions:{
        useUTC:false
    },
    timezone: '+07:00'
});

export default db;