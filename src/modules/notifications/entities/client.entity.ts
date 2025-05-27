import { Socket } from 'socket.io';

export class ClientEntity {
	userId: string;
	socket: Socket;

	constructor(userId: string, socket: Socket) {
		this.userId = userId;
		this.socket = socket;
	}
}
