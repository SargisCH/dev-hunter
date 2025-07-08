import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger('Websocket');

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const userId = client.handshake.query.clientId as string;

    if (!userId) {
      this.logger.log(`Connection rejected: no userId`);
      client.disconnect(true);
      return;
    }

    // Join the user room by userId
    client.join(userId);
    this.logger.log(`Client ${client.id} joined user room: ${userId}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  sendMessageToUser(userId: string, message: string) {
    this.server.to(userId).emit('notification', {
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
