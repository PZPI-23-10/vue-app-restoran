import * as signalR from '@microsoft/signalr';
import AuthService from './auth.service';

class ChatService {
  constructor() {
    this.connection = null;
    this.sessionId = null;
  }

  async startConnection() {
    const user = AuthService.getCurrentUser();
    if (!user?.token) {
      throw new Error('User not authenticated');
    }

    const options = {
      accessTokenFactory: () => user.token,
      transport: signalR.HttpTransportType.LongPolling // Пока только LongPolling для Render Free
    };

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('https://backend-restoran.onrender.com/hubs/chat', options)
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.connection.on('ReceiveMessage', this.handleReceiveMessage);
    this.connection.on('ReceiveHistory', this.handleReceiveHistory);
    this.connection.on('SessionExpired', this.handleSessionExpired);

    await this.connection.start();
  }

  async createSession(restaurantId, userId) {
    if (!this.connection) await this.startConnection();
    this.sessionId = await this.connection.invoke('CreateChatSession', restaurantId, userId);
    return this.sessionId;
  }

  async joinSession(sessionId) {
    if (!this.connection) await this.startConnection();
    this.sessionId = sessionId;
    await this.connection.invoke('JoinChatSession', sessionId);
  }

  async sendMessage(text) {
    if (!this.connection || !this.sessionId) throw new Error('Not connected to a chat session');
    await this.connection.invoke('SendMessage', this.sessionId, text);
  }

  handleReceiveMessage = (message) => {
    if (this.onMessageReceived) this.onMessageReceived(message);
  }

  handleReceiveHistory = (history) => {
    if (this.onHistoryReceived) this.onHistoryReceived(history);
  }

  handleSessionExpired = () => {
    if (this.onSessionExpired) this.onSessionExpired();
  }

  stopConnection() {
    if (this.connection) {
      this.connection.stop();
      this.connection = null;
    }
  }
}

export default new ChatService();
