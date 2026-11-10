/**
 * AudioManager – wrapper aman untuk expo-av.
 * Menggunakan try/catch di setiap operasi sehingga tidak crash
 * ketika native module belum tersedia (misal saat dev di Expo Go
 * tanpa development build).
 */

let Audio: any = null;

// Lazy load expo-av agar tidak crash saat import
try {
  Audio = require('expo-av').Audio;
} catch (e) {
  console.warn('[AudioManager] expo-av native module not available. Audio disabled.');
}

type SfxType = 'correct' | 'wrong' | 'star' | 'celebrate';

class AudioManager {
  private static instance: AudioManager;
  private bgMusic: any = null;
  private currentNarration: any = null;
  private musicVolume: number = 0.5;
  private sfxVolume: number = 0.8;
  private isMusicPlaying: boolean = false;
  private isAvailable: boolean = !!Audio;

  private constructor() {
    if (!this.isAvailable) return;
    try {
      Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (e) {
      console.warn('[AudioManager] setAudioModeAsync failed:', e);
    }
  }

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  // ── BACKGROUND MUSIC ──────────────────────────────────────────────

  async playBgMusic(): Promise<void> {
    if (!this.isAvailable) return;
    try {
      if (this.bgMusic) {
        await this.bgMusic.stopAsync();
        await this.bgMusic.unloadAsync();
        this.bgMusic = null;
      }
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/audio/music/bg_music.mp3'),
        { isLooping: true, volume: this.musicVolume, shouldPlay: true }
      );
      this.bgMusic = sound;
      this.isMusicPlaying = true;
    } catch (e) {
      console.log('[AudioManager] playBgMusic:', e);
    }
  }

  async stopBgMusic(): Promise<void> {
    if (!this.isAvailable || !this.bgMusic) return;
    try {
      await this.bgMusic.stopAsync();
      this.isMusicPlaying = false;
    } catch (e) {
      console.log('[AudioManager] stopBgMusic:', e);
    }
  }

  async pauseBgMusic(): Promise<void> {
    if (!this.isAvailable || !this.bgMusic || !this.isMusicPlaying) return;
    try {
      await this.bgMusic.pauseAsync();
      this.isMusicPlaying = false;
    } catch (e) {
      console.log('[AudioManager] pauseBgMusic:', e);
    }
  }

  async resumeBgMusic(): Promise<void> {
    if (!this.isAvailable || !this.bgMusic || this.isMusicPlaying) return;
    try {
      await this.bgMusic.playAsync();
      this.isMusicPlaying = true;
    } catch (e) {
      console.log('[AudioManager] resumeBgMusic:', e);
    }
  }

  // ── ANIMAL SOUNDS ─────────────────────────────────────────────────

  async playAnimalSound(animalId: string): Promise<void> {
    if (!this.isAvailable) return;
    try {
      await this._stopNarration();
      const soundMap: Record<string, any> = {
        lion:      require('../../assets/audio/sounds/lion.mp3'),
        elephant:  require('../../assets/audio/sounds/elephant.mp3'),
        tiger:     require('../../assets/audio/sounds/tiger.mp3'),
        giraffe:   require('../../assets/audio/sounds/giraffe.mp3'),
        fish:      require('../../assets/audio/sounds/fish.mp3'),
        dolphin:   require('../../assets/audio/sounds/dolphin.mp3'),
        whale:     require('../../assets/audio/sounds/whale.mp3'),
        eagle:     require('../../assets/audio/sounds/eagle.mp3'),
        parrot:    require('../../assets/audio/sounds/parrot.mp3'),
        butterfly: require('../../assets/audio/sounds/butterfly.mp3'),
        bee:       require('../../assets/audio/sounds/bee.mp3'),
        crocodile: require('../../assets/audio/sounds/crocodile.mp3'),
        horse:     require('../../assets/audio/sounds/horse.mp3'),
        cow:       require('../../assets/audio/sounds/cow.mp3'),
        rabbit:    require('../../assets/audio/sounds/rabbit.mp3'),
        octopus:   require('../../assets/audio/sounds/octopus.mp3'),
        crab:      require('../../assets/audio/sounds/crab.mp3'),
        shark:     require('../../assets/audio/sounds/shark.mp3'),
        owl:       require('../../assets/audio/sounds/owl.mp3'),
        flamingo:  require('../../assets/audio/sounds/flamingo.mp3'),
      };
      const asset = soundMap[animalId];
      if (!asset) return;
      const { sound } = await Audio.Sound.createAsync(asset, {
        volume: this.sfxVolume, shouldPlay: true,
      });
      this.currentNarration = sound;
      sound.setOnPlaybackStatusUpdate((status: any) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
          if (this.currentNarration === sound) this.currentNarration = null;
        }
      });
    } catch (e) {
      console.log('[AudioManager] playAnimalSound:', e);
    }
  }

  // ── NARRATION ─────────────────────────────────────────────────────

  async playNarration(lang: 'id' | 'en', animalId: string): Promise<void> {
    if (!this.isAvailable) return;
    try {
      await this._stopNarration();
      const narrationMap: Record<string, Record<string, any>> = {
        id: {
          lion:      require('../../assets/audio/narration/id/lion.mp3'),
          elephant:  require('../../assets/audio/narration/id/elephant.mp3'),
          tiger:     require('../../assets/audio/narration/id/tiger.mp3'),
          giraffe:   require('../../assets/audio/narration/id/giraffe.mp3'),
          fish:      require('../../assets/audio/narration/id/fish.mp3'),
          dolphin:   require('../../assets/audio/narration/id/dolphin.mp3'),
          whale:     require('../../assets/audio/narration/id/whale.mp3'),
          eagle:     require('../../assets/audio/narration/id/eagle.mp3'),
          parrot:    require('../../assets/audio/narration/id/parrot.mp3'),
          butterfly: require('../../assets/audio/narration/id/butterfly.mp3'),
          bee:       require('../../assets/audio/narration/id/bee.mp3'),
          crocodile: require('../../assets/audio/narration/id/crocodile.mp3'),
          horse:     require('../../assets/audio/narration/id/horse.mp3'),
          cow:       require('../../assets/audio/narration/id/cow.mp3'),
          rabbit:    require('../../assets/audio/narration/id/rabbit.mp3'),
          octopus:   require('../../assets/audio/narration/id/octopus.mp3'),
          crab:      require('../../assets/audio/narration/id/crab.mp3'),
          shark:     require('../../assets/audio/narration/id/shark.mp3'),
          owl:       require('../../assets/audio/narration/id/owl.mp3'),
          flamingo:  require('../../assets/audio/narration/id/flamingo.mp3'),
        },
        en: {
          lion:      require('../../assets/audio/narration/en/lion.mp3'),
          elephant:  require('../../assets/audio/narration/en/elephant.mp3'),
          tiger:     require('../../assets/audio/narration/en/tiger.mp3'),
          giraffe:   require('../../assets/audio/narration/en/giraffe.mp3'),
          fish:      require('../../assets/audio/narration/en/fish.mp3'),
          dolphin:   require('../../assets/audio/narration/en/dolphin.mp3'),
          whale:     require('../../assets/audio/narration/en/whale.mp3'),
          eagle:     require('../../assets/audio/narration/en/eagle.mp3'),
          parrot:    require('../../assets/audio/narration/en/parrot.mp3'),
          butterfly: require('../../assets/audio/narration/en/butterfly.mp3'),
          bee:       require('../../assets/audio/narration/en/bee.mp3'),
          crocodile: require('../../assets/audio/narration/en/crocodile.mp3'),
          horse:     require('../../assets/audio/narration/en/horse.mp3'),
          cow:       require('../../assets/audio/narration/en/cow.mp3'),
          rabbit:    require('../../assets/audio/narration/en/rabbit.mp3'),
          octopus:   require('../../assets/audio/narration/en/octopus.mp3'),
          crab:      require('../../assets/audio/narration/en/crab.mp3'),
          shark:     require('../../assets/audio/narration/en/shark.mp3'),
          owl:       require('../../assets/audio/narration/en/owl.mp3'),
          flamingo:  require('../../assets/audio/narration/en/flamingo.mp3'),
        },
      };
      const asset = narrationMap[lang]?.[animalId];
      if (!asset) return;
      const { sound } = await Audio.Sound.createAsync(asset, {
        volume: this.sfxVolume, shouldPlay: true,
      });
      this.currentNarration = sound;
      sound.setOnPlaybackStatusUpdate((status: any) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
          if (this.currentNarration === sound) this.currentNarration = null;
        }
      });
    } catch (e) {
      console.log('[AudioManager] playNarration:', e);
    }
  }

  // ── SFX ───────────────────────────────────────────────────────────

  async playSfx(type: SfxType): Promise<void> {
    if (!this.isAvailable) return;
    const sfxMap: Record<SfxType, any> = {
      correct:   require('../../assets/audio/sfx/correct.mp3'),
      wrong:     require('../../assets/audio/sfx/wrong.mp3'),
      star:      require('../../assets/audio/sfx/star.mp3'),
      celebrate: require('../../assets/audio/sfx/celebrate.mp3'),
    };
    try {
      const { sound } = await Audio.Sound.createAsync(sfxMap[type], {
        volume: this.sfxVolume, shouldPlay: true,
      });
      sound.setOnPlaybackStatusUpdate((status: any) => {
        if (status.isLoaded && status.didJustFinish) sound.unloadAsync();
      });
    } catch (e) {
      console.log('[AudioManager] playSfx:', e);
    }
  }

  // ── VOLUME ────────────────────────────────────────────────────────

  async setMusicVolume(volume: number): Promise<void> {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (!this.isAvailable || !this.bgMusic) return;
    try {
      await this.bgMusic.setVolumeAsync(this.musicVolume);
    } catch (e) {
      console.log('[AudioManager] setMusicVolume:', e);
    }
  }

  setSfxVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }

  // ── PRIVATE ───────────────────────────────────────────────────────

  private async _stopNarration(): Promise<void> {
    if (this.currentNarration) {
      try {
        await this.currentNarration.stopAsync();
        await this.currentNarration.unloadAsync();
      } catch (_) {}
      this.currentNarration = null;
    }
  }

  async cleanup(): Promise<void> {
    await this.stopBgMusic();
    await this._stopNarration();
    if (this.bgMusic) {
      try { await this.bgMusic.unloadAsync(); } catch (_) {}
      this.bgMusic = null;
    }
  }
}

export const audioManager = AudioManager.getInstance();
