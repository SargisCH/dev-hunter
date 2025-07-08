import { Injectable } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';

@Injectable()
export class WebsocketService {
  constructor(private readonly websockerGateway: WebsocketGateway) {}

  notifyUser(clientId: string, message: string) {
    this.websockerGateway.sendMessageToUser(clientId, message);
  }
}
