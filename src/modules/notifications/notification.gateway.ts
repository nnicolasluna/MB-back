import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
	cors: { origin: '*' },
	path: `/${process.env.API_ROOT}/socket.io`,
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
	private logger = new Logger(NotificationGateway.name);

	@WebSocketServer()
	server: Server;

	clients: Socket[] = [];

	constructor() {}

	handleConnection(client: Socket) {
		this.clients.push(client);
		this.logger.verbose(`Client connected: ${client.id}, total clients: ${this.clients.length}`);
	}

	handleDisconnect(client: Socket) {
		this.clients = this.clients.filter((c) => c.id !== client.id);
		this.logger.verbose(`Client disconnected: ${client.id}, total clients: ${this.clients.length}`);
	}
}
