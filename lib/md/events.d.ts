

declare module 'events' {

  export interface EventEmitter {
    addListener(event: string, listener: Function): EventEmitter;
    on(event: string, listener: Function): EventEmitter;

    once(event: string, listener: Function): EventEmitter;
    removeListener(event: string, listener: Function): EventEmitter;
    removeAllListeners(event?: string): EventEmitter;
    setMaxListeners(n: number): void;
    listeners(event: string): Array<Function>;
    emit(event: string, ...events?: Array<string>): boolean;
    listenerCount(event: string): number;
  }
}