


import net = require('net');


export class Connecion {
    private port: number;
    private host: string;
    private socket: net.Socket;
    private handlers: Array<>

    constructor(port: number, host?: string) {
        this.port = port;
        this.host = host || '127.0.0.1';
        this.connect();
    }

    private flush() {
        var i: number = 0;

        while (this.socket && i < handlers.length) {
            this.socket.write(handlers[i].getRequest());
            i++;
        }
    }

    private handleConnect() {
        process.nextTick(this.flush);
    }

    private handleData() {}

    private handleClose() {
        if (this.socket !== null) {
            this.socket.removeAllListeners();
            this.socket.destroy();
            this.socket = null;
        }
    }

    private handleError(error) {
        console.error('ERROR [node-md]: ' + JSON.stringify(error));
    }

    private connect() {
        this.socket = new net.Socket();

        this.socket.on('connect', this.handleConnect);
        this.socket.on('data', this.handleData);
        this.socket.on('close', this.handleClose);
        this.socket.on('error', this.handleError);

        this.socket.connect(this.port, this.host);
    }

    request(request: string, parser: Function, handler: Function) {
        this.handlers.push(new );
        process.nextTick(this.flush);
    }
}