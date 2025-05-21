import { io } from 'socket.io-client';

class SocketManager {
  constructor() {
    this.socket = null;
    this.BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5555';
    this.isConnecting = false;
  }

  connect() {
    if (this.socket) {
      return this.socket;
    }

    if (this.isConnecting) {
      return null;
    }

    this.isConnecting = true;

    try {
      this.socket = io(this.BACKEND_URL, {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        transports: ['websocket', 'polling'],
        autoConnect: true,
        withCredentials: true,
      });

      this.setupEventListeners();
      return this.socket;
    } catch (error) {
      console.error('Socket connection error:', error);
      return null;
    } finally {
      this.isConnecting = false;
    }
  }

  setupEventListeners() {
    if (!this.socket) return;

    // Remove any existing listeners first
    this.removeAllListeners();

    // Connection events
    this.socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    this.socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected:', reason);
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, reconnect manually
        this.socket.connect();
      }
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('Reconnected after', attemptNumber, 'attempts');
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log('Reconnection attempt:', attemptNumber);
    });

    this.socket.on('reconnect_error', (err) => {
      console.error('Reconnection error:', err);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('Failed to reconnect');
      this.disconnect();
    });

    // Error handling
    this.socket.on('error', (err) => {
      console.error('Socket error:', err);
    });
  }

  disconnect() {
    if (this.socket) {
      this.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Room events
  joinRoom(roomId, username) {
    if (!this.socket || !roomId || !username) return;
    this.socket.emit('join', { roomId, username });
  }

  leaveRoom(roomId, username) {
    if (!this.socket || !roomId || !username) return;
    this.socket.emit('leave', { roomId, username });
  }

  // Code sync events
  emitCodeChange(roomId, code, sender,username) {
    if (!this.socket || !roomId) return;
    this.socket.emit('code-change', { roomId, code, sender,username });
  }

  onCodeChange(callback) {
    if (!this.socket || !callback) return;
    // Remove existing listeners before adding new one
    this.socket.off('code-change');
    this.socket.on('code-change', callback);
  }

  // User events
  onUserJoined(callback) {
    if (!this.socket || !callback) return;
    // Remove existing listeners before adding new one
    this.socket.off('user-joined');
    this.socket.on('user-joined', callback);
  }

  onUserLeft(callback) {
    if (!this.socket || !callback) return;
    // Remove existing listeners before adding new one
    this.socket.off('user-left');
    this.socket.on('user-left', callback);
  }

  onUserDisconnected(callback) {
    if (!this.socket || !callback) return;
    // Remove existing listeners before adding new one
    this.socket.off('user-disconnected');
    this.socket.on('user-disconnected', callback);
  }

  // Cleanup
  removeAllListeners() {
    if (!this.socket) return;
    this.socket.removeAllListeners();
  }

  // Message events
  emmitMessage(roomId, message, sender) {
    if (!this.socket || !roomId) return;
    this.socket.emit('send-message', {
      roomId,
      message,
      sender,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    });
  }

  onMessage(callback) {
    if (!this.socket || !callback) return;
    // Remove existing listeners before adding new one
    this.socket.off('receive-message');
    this.socket.on('receive-message', callback);
  }
}

// Create a singleton instance
const socketManager = new SocketManager();
export default socketManager;