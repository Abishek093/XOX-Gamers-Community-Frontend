import io from 'socket.io-client';
import { store } from '../../store';
import { updateUnreadCount, updateLastMessage } from '../../Slices/userSlice/chatSlice'
import { IMessage } from '../../interfaces/userInterfaces/apiInterfaces';

class WebSocketService {
  private socket: SocketIOClient.Socket;

  constructor() {
    this.socket = io(import.meta.env.VITE_CHAT_SOCKET_URL);
    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.socket.on('message', this.handleNewMessage);
    this.socket.on('unreadCount', this.handleUnreadCount);
  }

  private handleNewMessage = (message: IMessage) => {
    store.dispatch(updateLastMessage({ chatId: message.chatId, message }));
    // Play new message sound here
    this.playNewMessageSound();
  }

  private handleUnreadCount = ({ chatId, count }: { chatId: string; count: number }) => {
    store.dispatch(updateUnreadCount({ chatId, count }));
  }

  private playNewMessageSound() {
    // Implement sound playing logic here
  }

  public joinRoom(roomId: string) {
    this.socket.emit('join', roomId);
  }

  public leaveRoom(roomId: string) {
    this.socket.emit('leave', roomId);
  }

  public sendMessage(message: IMessage) {
    this.socket.emit('message', message);
  }

  public markMessageAsSeen(messageId: string, chatId: string) {
    this.socket.emit('messageSeen', { messageId, chatId });
  }

  // New methods to add and remove event listeners
  public on(event: string, callback: (...args: any[]) => void) {
    this.socket.on(event, callback);
  }

  public off(event: string, callback: (...args: any[]) => void) {
    this.socket.off(event, callback);
  }
}

export const webSocketService = new WebSocketService();