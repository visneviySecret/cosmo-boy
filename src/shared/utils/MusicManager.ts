import { SETTINGS_KEY } from "../../features/game/utils/gameSave";

export interface MusicTrack {
  key: string;
  path: string;
  level?: number;
  isCredits?: boolean;
}

export class MusicManager {
  private scene: Phaser.Scene;
  private currentTrack: Phaser.Sound.BaseSound | null = null;
  private currentTrackKey: string | null = null;
  private volume: number = 0.5;
  private tracks: MusicTrack[] = [
    {
      key: "level1-2",
      path: "assets/music/Cosmic Clarity (level 1-2).mp3",
      level: 1,
    },
    {
      key: "level3-4",
      path: "assets/music/Cosmic Cycles (Level 3-4).mp3",
      level: 3,
    },
    {
      key: "level5",
      path: "assets/music/Whispers in the Web (level 5).mp3",
      level: 5,
    },
    {
      key: "level6",
      path: "assets/music/Cosmic Flight (level 6).mp3",
      level: 6,
    },
    {
      key: "credits",
      path: "assets/music/Cosmic Wings (credits).mp3",
      isCredits: true,
    },
  ];
  private trackPositions: { [key: string]: number } = {};
  private isInitialized: boolean = false;
  private pendingTrack: string | null = null;
  private audioContextResumed: boolean = false;
  private currentPlayerLevel: number = 1;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.loadVolume();
    this.setupAudioContextHandler();
  }

  private setupAudioContextHandler(): void {
    const resumeAudioContext = async () => {
      if (this.scene && this.scene.sound && (this.scene.sound as any).context) {
        try {
          const audioContext = (this.scene.sound as any).context;
          if (audioContext.state === "suspended") {
            await audioContext.resume();
            this.audioContextResumed = true;

            if (this.pendingTrack) {
              this.playTrack(this.pendingTrack);
              this.pendingTrack = null;
            }
          }
        } catch (error) {
          // Тихо обрабатываем ошибку
        }
      }

      document.removeEventListener("click", resumeAudioContext);
      document.removeEventListener("keydown", resumeAudioContext);
      document.removeEventListener("touchstart", resumeAudioContext);
    };

    document.addEventListener("click", resumeAudioContext, { once: true });
    document.addEventListener("keydown", resumeAudioContext, { once: true });
    document.addEventListener("touchstart", resumeAudioContext, { once: true });
  }

  public preloadTracks(): void {
    this.tracks.forEach((track) => {
      this.scene.load.audio(track.key, track.path);
    });
  }

  public initialize(): void {
    if (this.isInitialized) return;

    if (!this.scene || !this.scene.cache || !this.scene.sound) {
      return;
    }

    this.isInitialized = true;
  }

  public playLevelMusic(level: number): void {
    let trackKey = "level1-2";

    if (level >= 6) {
      trackKey = "level6";
    } else if (level >= 5) {
      trackKey = "level5";
    } else if (level >= 3) {
      trackKey = "level3-4";
    }

    this.playTrack(trackKey);
  }

  public playCreditsMusic(): void {
    this.playTrack("credits");
  }

  private playTrack(trackKey: string): void {
    if (!this.scene || !this.scene.sound || !this.scene.cache) {
      return;
    }

    if (!this.scene.cache.audio.exists(trackKey)) {
      return;
    }

    const audioContext = (this.scene.sound as any).context;
    if (audioContext && audioContext.state === "suspended") {
      this.pendingTrack = trackKey;
      return;
    }

    if (
      this.currentTrackKey === trackKey &&
      this.currentTrack &&
      this.currentTrack.isPlaying
    ) {
      return;
    }

    if (this.currentTrack && this.currentTrackKey) {
      this.trackPositions[this.currentTrackKey] =
        (this.currentTrack as any).seek || 0;
      this.currentTrack.stop();
    }

    try {
      this.currentTrack = this.scene.sound.add(trackKey, {
        volume: this.volume,
        loop: true,
      });

      this.currentTrackKey = trackKey;

      const savedPosition = this.trackPositions[trackKey] || 0;

      this.currentTrack.play();

      if (savedPosition > 0) {
        this.scene.time.delayedCall(100, () => {
          if (this.currentTrack && (this.currentTrack as any).seek) {
            (this.currentTrack as any).seek = savedPosition;
          }
        });
      }

      this.currentTrack.on("complete", () => {
        if (this.currentTrackKey === trackKey) {
          this.trackPositions[trackKey] = 0;
          this.currentTrack?.play();
        }
      });
    } catch (error) {
      // Тихо обрабатываем ошибку
    }
  }

  public pauseCurrentTrack(): void {
    if (this.currentTrack && this.currentTrack.isPlaying) {
      if (this.currentTrackKey) {
        this.trackPositions[this.currentTrackKey] =
          (this.currentTrack as any).seek || 0;
      }
      this.currentTrack.pause();
    }
  }

  public resumeCurrentTrack(): void {
    if (this.currentTrack && this.currentTrack.isPaused) {
      this.currentTrack.resume();
    }
  }

  public stopCurrentTrack(): void {
    if (this.currentTrack) {
      if (this.currentTrackKey) {
        this.trackPositions[this.currentTrackKey] = 0;
      }
      this.currentTrack.stop();
      this.currentTrack = null;
      this.currentTrackKey = null;
    }
  }

  public setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume / 100));

    if (this.currentTrack) {
      (this.currentTrack as any).volume = this.volume;
    }

    if (this.scene && this.scene.sound) {
      this.scene.sound.volume = this.volume;
    }
  }

  private loadVolume(): void {
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      this.setVolume(settings.volume ?? 50);
    }
  }

  public setCurrentPlayerLevel(level: number): void {
    this.currentPlayerLevel = level;
    if (this.audioContextResumed || this.isAudioContextReady()) {
      this.playLevelMusic(level);
    }
    this.loadVolume();
  }

  private isAudioContextReady(): boolean {
    if (!this.scene || !this.scene.sound) return false;
    const audioContext = (this.scene.sound as any).context;
    return !audioContext || audioContext.state === "running";
  }

  public forcePlayLevelMusic(): void {
    this.playLevelMusic(this.currentPlayerLevel);
  }

  public destroy(): void {
    this.stopCurrentTrack();
    this.trackPositions = {};
    this.isInitialized = false;
    this.pendingTrack = null;
  }
}
