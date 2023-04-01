const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const PORT = process.env.PORT || 8000;
const db = require('./models');
const { users } = require('./models');
const { messages } = require('./models');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: '*'
    }
});
// db.sequelize.drop();
io.on('connection', async (socket) => {
    socket.on('new_message', async (data) => {
        const { sender, reciever, title, body } = data;
        const [send, created] = await users.findOrCreate({ where: { name: sender }, defaults: { name: sender }});
        const [rec, checked] = await users.findOrCreate({ where: { name: reciever }, defaults: { name: reciever }});
        messages.create({ title: title, body: body, from: send.id, to: rec.id, fromOf: send.name });
    })
});

io.on('connection', async (socket) => {
    let curUser;
    socket.on('allHisMessages', async (data) => {
        curUser = data.user;
        const [user, created] = await users.findOrCreate({ where: { name: curUser }});
         
        messages.findAll({ where: { to: user.id }})
        .then((userMessages) => {
            socket.emit('allHisMessages', userMessages);
        })
    });
});

db.sequelize.sync({ alter: true })
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Listening on port: ${PORT}`);
        });
    })
    .catch((err) => {
        console.log(`Error with init: ${err}`);
    });


