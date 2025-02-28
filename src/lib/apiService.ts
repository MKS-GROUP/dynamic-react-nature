
import { io, Socket } from 'socket.io-client';

interface GameData {
  gameStarted: boolean;
  teamNames: { teamA: string; teamB: string };
  scores: { teamA: number; teamB: number };
  winner: string | null;
}

class ApiService {
  private static instance: ApiService;
  private socket: Socket | null = null;
  private apiUrl: string;
  private listeners: Array<(data: GameData) => void> = [];
  private connectionAttempts: number = 0;
  private maxConnectionAttempts: number = 3;
  private isConnecting: boolean = false;
  private reconnectTimer: any = null;

  
  private constructor() {
    // Get server IP from URL parameters if available
    const urlParams = new URLSearchParams(window.location.search);
    const serverIP = urlParams.get('server');
    
    // Use param, or local IP, or fallback to localhost
    if (serverIP) {
      this.apiUrl = `http://${serverIP}:5000`;
    } else {
      // Try to use the server's IP if we're on the same network
      // Fallback to localhost if not explicitly specified
      this.apiUrl = 'http://localhost:5000';
    }
    
    console.log('Connecting to API at:', this.apiUrl);
    this.initSocket();
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  public getConnectionUrl(): string {
    return this.apiUrl;
  }

  private initSocket(): void {
    if (this.isConnecting) return;
    this.isConnecting = true;
    
    try {
      console.log('Initializing socket connection to:', this.apiUrl);
      
      if (this.socket) {
        this.socket.disconnect();
      }
      
      this.socket = io(this.apiUrl, {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 5000
      });

      this.socket.on('connect', () => {
        console.log('Connected to server with ID:', this.socket?.id);
        this.connectionAttempts = 0;
        this.isConnecting = false;
        
        // Clear any reconnect timers
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = null;
        }
        
        // Request initial data
        this.socket?.emit('getGameData');
      });

      this.socket.on('gameData', (data: GameData) => {
        console.log('Received game data update:', data);
        this.notifyListeners(data);
      });

      this.socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        this.connectionAttempts++;
        this.isConnecting = false;
        
        if (this.connectionAttempts >= this.maxConnectionAttempts && !this.reconnectTimer) {
          console.log(`Failed to connect after ${this.maxConnectionAttempts} attempts. Will try again in 10 seconds.`);
          // Try again in 10 seconds
          this.reconnectTimer = setTimeout(() => {
            this.connectionAttempts = 0;
            this.initSocket();
          }, 10000);
        }
      });
      
      this.socket.on('disconnect', (reason) => {
        console.log('Disconnected from server:', reason);
        this.isConnecting = false;
      });
    } catch (error) {
      console.error('Socket initialization error:', error);
      this.isConnecting = false;
    }
  }

  public async getGameData(): Promise<GameData | null> {
    try {
      console.log('Fetching game data from:', `${this.apiUrl}/api/game`);
      const response = await fetch(`${this.apiUrl}/api/game`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add a cache buster to avoid cached responses
        cache: 'no-store',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch game data: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Received game data via REST:', data);
      return data;
    } catch (error) {
      console.error('Error fetching game data:', error);
      return null;
    }
  }

  public async updateGameData(data: GameData): Promise<boolean> {
    try {
      console.log('Updating game data via REST API:', data);
      
      // Update via REST API
      const response = await fetch(`${this.apiUrl}/api/game`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to update game data: ${response.status} ${response.statusText}`);
      }

      // Also emit via socket for real-time updates
      if (this.socket && this.socket.connected) {
        console.log('Emitting update via socket');
        this.socket.emit('updateGameData', data);
      } else {
        console.log('Socket not connected, only using REST API');
        // Try to reconnect socket
        this.initSocket();
      }

      return true;
    } catch (error) {
      console.error('Error updating game data:', error);
      return false;
    }
  }

  public subscribeToUpdates(callback: (data: GameData) => void): void {
    this.listeners.push(callback);
  }

  public unsubscribeFromUpdates(callback: (data: GameData) => void): void {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  private notifyListeners(data: GameData): void {
    this.listeners.forEach(listener => listener(data));
  }

  // Allow manually changing the server
  public setServerUrl(url: string): void {
    if (url && url !== this.apiUrl) {
      this.apiUrl = url.startsWith('http') ? url : `http://${url}:5000`;
      console.log('Changing server URL to:', this.apiUrl);
      this.initSocket();
    }
  }
}

export const apiService = ApiService.getInstance();
