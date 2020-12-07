const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const fs = require('fs')


class Server {
    private clients = [];

    constructor() {
        app.use(express.static(__dirname + '/public'));
        server.listen(3000);
        this.createRoutes();
        this.connect();
    }

    private createRoutes(): boolean {
        app.get('/', (req, res) => {
            res.sendFile(__dirname + '/public/index.html');
        });

        return true;
    }

    private connect(): boolean {
        io.sockets.on('connection', (socket) => {
            console.log("Успешное соединение");
            this.clients.push(socket);

            socket.on('disconnect', (data) => {
                this.clients.splice(this.clients.indexOf(socket), 1);
                console.log("Отключились");
            });

            socket.on('send message', (data) => {
                io.sockets.emit('add message', {message: data.message, name: data.name});
                this.saveLogs(data);
            });

        });

        return true;
    }

    private saveLogs(data): void {
        const today = new Date();
        const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        const text: string = date +' '+ time + ' | ' + data.name + ": " + data.message + "\n";
        fs.appendFileSync(__dirname + '/logs/log.txt', text);
    }
}

new Server();