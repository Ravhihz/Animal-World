import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityRecord } from '../store/useProgressStore';

const STORAGE_KEY = 'animal-world-progress';

export interface ProgressData {
  totalStars: number;
  unlockedAnimals: string[];
  collectedStickers: string[];
  earnedBadges: string[];
  activityHistory: ActivityRecord[];
}

const defaultProgress: ProgressData = {
  totalStars: 0,
  unlockedAnimals: ['lion', 'elephant', 'fish', 'eagle', 'butterfly'],
  collectedStickers: [],
  earnedBadges: [],
  activityHistory: [],
};

export const ProgressService = {
  async loadProgress(): Promise<ProgressData> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...defaultProgress };
      return { ...defaultProgress, ...JSON.parse(raw) };
    } catch (e) {
      console.log('[ProgressService] loadProgress error:', e);
      return { ...defaultProgress };
    }
  },

  async saveProgress(data: Partial<ProgressData>): Promise<void> {
    try {
      const existing = await this.loadProgress();
      const merged = { ...existing, ...data };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    } catch (e) {
      console.log('[ProgressService] saveProgress error:', e);
    }
  },

  async resetProgress(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.log('[ProgressService] resetProgress error:', e);
    }
  },

  async recordActivity(record: ActivityRecord): Promise<void> {
    try {
      const progress = await this.loadProgress();
      const history = [record, ...progress.activityHistory].slice(0, 100);
      await this.saveProgress({ activityHistory: history });
    } catch (e) {
      console.log('[ProgressService] recordActivity error:', e);
    }
  },
};
