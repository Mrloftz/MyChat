import {Injectable} from '@angular/core';
import * as socketIo from 'socket.io-client';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

interface User {
    id?: number;
    name?: string;
    avatar?: string;
}

enum Action {
    JOINED,
    LEFT,
    RENAME
}

export enum Event {
    CONNECT = 'connect',
    DISCONNECT = 'disconnect'
}

interface Message {
    from?: User;
    content?: any;
    action?: Action;
}

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    SERVER_URL = environment.socketUrl;
    private socket;

    constructor() {
        this.socket = socketIo(this.SERVER_URL);
    }

    onEvent(event: Event): Observable<any> {
        return new Observable<Event>(observer => {
            this.socket.on(event, () => observer.next());
        });
    }

    // -------------------- Message
    addUser(userName: string): void {
        this.socket.emit('adduser', userName);
    }

    switchRoom(room: string): void {
        this.socket.emit('switchRoom', room);
    }

    joinRoom(room: string): void {
        this.socket.emit('join_room', room);
    }

    sendChat(message: string , time: any , type: any): void {
        this.socket.emit('sendchat', message, time, type);
    }

    leaveRoom(room) {
        this.socket.emit('leave_room', room);
    }

    onUpdateRooms(): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on('updaterooms', (data: any) => observer.next(data));
        });
    }

    onUpdateChat(): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on('updatechat', (username: any, data: any, time: any, type) => observer.next(
                {
                    'username': username,
                    'data': data,
                    'updatedAt': time,
                    'type': type
                }
            ));
        });
    }

    // -------------------- END Message

    // -------------------- Poll
    onActivePoll(): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on('vote', (data: any) => observer.next(data));
        });
    }

    // -------------------- END Poll

}
