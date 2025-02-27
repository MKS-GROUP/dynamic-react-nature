
class AudioService {
  private static instance: AudioService;
  private audio: HTMLAudioElement | null = null;
  private isPlaying = false;

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  public playVictorySound(): void {
    // If already playing, don't start again
    if (this.isPlaying) return;

    // Create audio element if it doesn't exist
    if (!this.audio) {
      this.audio = new Audio("/victory.mp3");
      this.audio.addEventListener("ended", () => {
        this.isPlaying = false;
      });
    }

    // Play the sound
    this.audio.currentTime = 0;
    this.isPlaying = true;
    this.audio.play().catch(error => {
      console.error("Error playing audio:", error);
      this.isPlaying = false;
    });
  }

  public stopVictorySound(): void {
    if (this.audio && this.isPlaying) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.isPlaying = false;
    }
  }
}

export const audioService = AudioService.getInstance();
