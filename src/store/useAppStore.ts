import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../locales/i18n';

interface AppState {
  language: 'id' | 'en';
  musicVolume: number;        // 0.0 – 1.0
  sfxVolume: number;          // 0.0 – 1.0
  isParentUnlocked: boolean;  // parental gate untuk sesi ini

  setLanguage: (lang: 'id' | 'en') => void;
  setMusicVolume: (vol: number) => void;
  setSfxVolume: (vol: number) => void;
  setParentUnlocked: (val: boolean) => void;
  resetParentLock: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: 'id',
      musicVolume: 0.5,
      sfxVolume: 0.8,
      isParentUnlocked: false,

      setLanguage: (lang) => {
        i18n.changeLanguage(lang);
        set({ language: lang });
      },

      setMusicVolume: (vol) => set({ musicVolume: Math.max(0, Math.min(1, vol)) }),
      setSfxVolume: (vol) => set({ sfxVolume: Math.max(0, Math.min(1, vol)) }),
      setParentUnlocked: (val) => set({ isParentUnlocked: val }),

      // Reset parent lock setiap sesi baru (dipanggil di app startup)
      resetParentLock: () => set({ isParentUnlocked: false }),
    }),
    {
      name: 'animal-world-app',
      storage: createJSONStorage(() => AsyncStorage),
      // Jangan persist isParentUnlocked — harus login setiap sesi
      partialize: (state) => ({
        language: state.language,
        musicVolume: state.musicVolume,
        sfxVolume: state.sfxVolume,
      }),
    }
  )
);
