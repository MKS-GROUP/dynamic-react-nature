
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

  private constructor() {
    // Use localhost for development, or dynamically determine for production
    this.apiUrl = 'http://localhost:5000';
    this.initSocket();
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private initSocket(): void {
    try {
      this.socket = io(this.apiUrl);

      this.socket.on('connect', () => {
        console.log('Connected to server');
      });

      this.socket.on('gameData', (data: GameData) => {
        console.log('Received game data update:', data);
        this.notifyListeners(data);
      });

      this.socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
      });
    } catch (error) {
      console.error('Socket initialization error:', error);
    }
  }

  public async getGameData(): Promise<GameData | null> {
    try {
      const response = await fetch(`${this.apiUrl}/api/game`);
      if (!response.ok) {
        throw new Error('Failed to fetch game data');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching game data:', error);
      return null;
    }
  }

  public async updateGameData(data: GameData): Promise<boolean> {
    try {
      // Update via REST API
      const response = await fetch(`${this.apiUrl}/api/game`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update game data');
      }

      // Also emit via socket for real-time updates
      if (this.socket && this.socket.connected) {
        this.socket.emit('updateGameData', data);
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
}

export const apiService = ApiService.getInstance();
