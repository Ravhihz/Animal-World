import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ActivityRecord {
  type: 'matching' | 'puzzle' | 'coloring' | 'animals';
  animalId?: string;
  starsEarned: number;
  completedAt: number; // timestamp
}

interface ProgressState {
  totalStars: number;
  unlockedAnimals: string[];       // array animal ID
  collectedStickers: string[];     // array sticker ID
  earnedBadges: string[];          // array badge ID
  activityHistory: ActivityRecord[];
  newlyUnlockedAnimals: string[];  // untuk notifikasi "hewan baru!"
  newlyEarnedBadges: string[];     // untuk notifikasi "badge baru!"

  addStars: (count: number) => void;
  unlockAnimal: (id: string) => void;
  collectSticker: (id: string) => void;
  earnBadge: (id: string) => void;
  recordActivity: (record: ActivityRecord) => void;
  clearNewlyUnlocked: () => void;
  resetProgress: () => void;
}

const initialState = {
  totalStars: 0,
  unlockedAnimals: ['lion', 'elephant', 'fish', 'eagle', 'butterfly'], // 5 default unlock
  collectedStickers: [],
  earnedBadges: [],
  activityHistory: [],
  newlyUnlockedAnimals: [],
  newlyEarnedBadges: [],
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...initialState,

      addStars: (count) =>
        set((state) => ({ totalStars: state.totalStars + count })),

      unlockAnimal: (id) =>
        set((state) => {
          if (state.unlockedAnimals.includes(id)) return state;
          return {
            unlockedAnimals: [...state.unlockedAnimals, id],
            newlyUnlockedAnimals: [...state.newlyUnlockedAnimals, id],
          };
        }),

      collectSticker: (id) =>
        set((state) => {
          if (state.collectedStickers.includes(id)) return state;
          return { collectedStickers: [...state.collectedStickers, id] };
        }),

      earnBadge: (id) =>
        set((state) => {
          if (state.earnedBadges.includes(id)) return state;
          return {
            earnedBadges: [...state.earnedBadges, id],
            newlyEarnedBadges: [...state.newlyEarnedBadges, id],
          };
        }),

      recordActivity: (record) =>
        set((state) => ({
          activityHistory: [record, ...state.activityHistory].slice(0, 100), // simpan 100 terakhir
        })),

      clearNewlyUnlocked: () =>
        set({ newlyUnlockedAnimals: [], newlyEarnedBadges: [] }),

      resetProgress: () => set({ ...initialState }),
    }),
    {
      name: 'animal-world-progress',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
