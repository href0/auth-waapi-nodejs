import { createRequire } from "module"; // agara tetap bisa memakai require()
import express, { response } from "express";
import db from "./config/Database.js";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";
import dotenv from "dotenv";
import cors from "cors";
import http from "http"
import qrcode from "qrcode"
import { Client } from "whatsapp-web.js"
import fs from "fs"

const port = process.env.PORT || 5000
const require = createRequire(import.meta.url);
const socketIO = require('socket.io')
dotenv.config()
const app = express()
const server = http.createServer(app)
const io = socketIO(server)


/* ---------Handel API Whatsapp--------- */
const SESSION_FILE_PATH = './whatsapp-session.json';
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionCfg = require('./whatsapp-session.json');
}

const client = new Client({ 
    puppeteer: { 
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process', // <- this one doesn't works in Windows
            '--disable-gpu'
        ],
    }, 
    session: sessionCfg 
});

client.initialize();
/* ------End Handle API Whatsapp------ */

// memastikan koneksi database berjalan dnegan baik
try {
    await db.authenticate()
    console.log('Database connected...')
} catch (error) {
    console.error(error)
}

app.use(cors({
    credentials:true,
    origin:[
        'http://localhost:3000',
        'http://192.168.100.19:5000/users'
    ]
}));
app.use(cookieParser());
app.use(express.json())
app.use(router)
app.use(express.urlencoded({ extended:true }))
// socket io
io.on('connection', function(socket){
    socket.emit('message', 'Connecting... please wait')
    
    client.on('ready', () => {
        socket.emit('ready', 'Whatsapp ready to use')
        socket.emit('message', 'Whatsapp ready to use')
    });

    client.on('qr', (qr) => {
        // Generate and scan this code with your phone
        // console.log('QR RECEIVED', qr);
        qrcode.toDataURL(qr,(err, url) => {
            socket.emit('qr', url)
            socket.emit('message', 'QR Code Ready, please scan')
        })
    });

    client.on('authenticated', (session) => {
    socket.emit('authenticated', 'Whatsapp authenticated')
    socket.emit('message', 'Whatsapp authenticated')
    // console.log('AUTHENTICATED', session);
    sessionCfg=session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
            if (err) {
                console.error(err);
            }
        });
    });
})

// send OTP
export const sendOTP = (nohp, otp) => {  
    const msg = `KARKOON - Kode OTP anda : ${otp}. Kode ini hanya berlaku selama 2 menit. Terima kasih`
        client.sendMessage(nohp, msg)
}

server.listen(port, () => console.log('server running at port 5000'))