

// node v0.10.25

import events = require("events");

declare module 'net' {

  interface SocketOptions {
    fd?: number;
    readable?: boolean;
    writable?: boolean;
    allowHalfOpen?: boolean
  }

  interface ConnectionOptions {
    port: number;
    host?: string;
    localAddress?: string;
    allowHalfOpen?: boolean;
  }

  interface ServerOptions {
    allowHalfOpen?: boolean;
  }

  interface Connection extends events.EventEmitter {
    address(): {
      port: number;
      family: string;
      address: string;
    };
    unref(): void;
    ref(): void;
  }

  interface Socket extends Connection {
    bufferSize: number;
    remoteAddress: string;
    remotePort: number;
    localAddress: string;
    localPort: number;
    bytesRead: number;
    bytesWritten: number;

    new (options?: SocketOptions): Socket;

    connect(port: number, host?: string, connectListener?: Function): void;
    connect(path: string, connectListener?: Function): void;

    setEncoding(encoding?: string): void
    write(data: any, encoding?: string, callback?: Function): boolean
    end(data?: any, encoding?: string): void;
    destroy(): void;
    pause(): void;
    resume(): void;
    setTimeout(timeout: number, callback?: Function): void;
    setNoDelay(noDelay?: boolean): void;
    setKeepAlive(enable?: boolean, initialDelay?: number): void;
  }


  export interface Server extends Connection {
    maxConnections: number;
    connections: number;

    listen(port: number, host?: string, backlog?: number, callback?: Function):
        Server;
    listen(path: string, callback?: Function): Server;
    listen(handle: any, callback?: Function): Server;

    close(callback?: Function): Server;
  }

  export function createServer(options?: ServerOptions,
                               connectionListener?: Function): Server;


  export function connect(options: ConnectionOptions,
                          connectionListener?: Function): Socket;

  export function createConnection(options: ConnectionOptions,
                                   connectionListener?: Function): Socket;


  export function connect(port: number, host?: string,
                          connectListener?: Function): Socket;

  export function createConnection(port: number, host?: string,
                          connectListener?: Function): Socket;


  export function connect(path: string, connectListener?: Function): Socket;

  export function createConnection(path: string,
                                   connectListener?: Function): Socket;


  export function isIP(input: string): number;
  export function isIPv4(input: string): boolean;
  export function isIPv6(input: string): boolean;

}
