import { animals } from '../data/animals';
import { badges, Badge } from '../data/badges';
import { starThresholds } from '../data/levels';
import { useProgressStore, ActivityRecord } from '../store/useProgressStore';
import { audioManager } from './AudioManager';

export interface ActivityMetrics {
  // Matching
  wrongAnswers?: number;
  // Puzzle
  hintsUsed?: number;
  // Coloring
  coloredPercent?: number;
}

export const RewardService = {
  /**
   * Kalkulasi bintang berdasarkan tipe aktivitas dan metrik
   */
  calculateStars(
    activityType: 'matching' | 'puzzle' | 'coloring',
    metrics: ActivityMetrics
  ): 1 | 2 | 3 {
    if (activityType === 'matching') {
      const wrong = metrics.wrongAnswers ?? Infinity;
      if (wrong === 0) return 3;
      if (wrong <= 3) return 2;
      return 1;
    }

    if (activityType === 'puzzle') {
      const hints = metrics.hintsUsed ?? Infinity;
      if (hints === 0) return 3;
      if (hints <= 1) return 2;
      return 1;
    }

    if (activityType === 'coloring') {
      const percent = metrics.coloredPercent ?? 0;
      if (percent >= starThresholds.coloring.three.minPercent) return 3;
      if (percent >= starThresholds.coloring.two.minPercent) return 2;
      return 1;
    }

    return 1;
  },

  /**
   * Cek badge mana yang baru terbuka berdasarkan progress saat ini
   */
  checkBadgeUnlocks(
    totalStars: number,
    unlockedAnimals: string[],
    activityHistory: ActivityRecord[],
    earnedBadges: string[]
  ): Badge[] {
    const newBadges: Badge[] = [];

    for (const badge of badges) {
      if (earnedBadges.includes(badge.id)) continue;

      const { type, value, activityType } = badge.condition;

      let earned = false;

      if (type === 'stars') {
        earned = totalStars >= value;
      } else if (type === 'unlock_count') {
        earned = unlockedAnimals.length >= value;
      } else if (type === 'activity_count') {
        earned = activityHistory.length >= value;
      } else if (type === 'specific_activity' && activityType) {
        const count = activityHistory.filter((a) => a.type === activityType).length;
        earned = count >= value;
      }

      if (earned) newBadges.push(badge);
    }

    return newBadges;
  },

  /**
   * Hewan mana yang bisa di-unlock dengan stars yang dimiliki
   */
  getUnlockableAnimals(
    totalStars: number,
    unlockedAnimals: string[]
  ): typeof animals {
    return animals.filter(
      (a) =>
        !unlockedAnimals.includes(a.id) &&
        !a.isDefaultUnlocked &&
        a.unlockCost <= totalStars
    );
  },

  /**
   * Orkestrasi setelah aktivitas selesai:
   * hitung bintang → update store → cek badge → unlock hewan → play audio
   */
  async processActivityCompletion(
    activityType: 'matching' | 'puzzle' | 'coloring',
    metrics: ActivityMetrics,
    animalId?: string
  ): Promise<{ stars: 1 | 2 | 3; newBadges: Badge[]; newAnimals: string[] }> {
    const stars = this.calculateStars(activityType, metrics);

    const store = useProgressStore.getState();

    // Tambah bintang
    store.addStars(stars);

    // Record aktivitas
    const record: ActivityRecord = {
      type: activityType,
      animalId,
      starsEarned: stars,
      completedAt: Date.now(),
    };
    store.recordActivity(record);

    // Update state setelah addStars
    const updatedStore = useProgressStore.getState();

    // Cek badge baru
    const newBadges = this.checkBadgeUnlocks(
      updatedStore.totalStars,
      updatedStore.unlockedAnimals,
      updatedStore.activityHistory,
      updatedStore.earnedBadges
    );

    for (const badge of newBadges) {
      store.earnBadge(badge.id);
    }

    // Cek hewan yang bisa di-unlock (auto-unlock yang sudah cukup bintang)
    const unlockableAnimals = this.getUnlockableAnimals(
      updatedStore.totalStars,
      updatedStore.unlockedAnimals
    );

    // Auto unlock hewan dengan cost paling rendah yang terjangkau
    const newAnimalIds: string[] = [];
    for (const animal of unlockableAnimals.slice(0, 1)) {
      // Unlock 1 hewan per aktivitas
      store.unlockAnimal(animal.id);
      newAnimalIds.push(animal.id);
    }

    // Play audio
    await audioManager.playSfx('celebrate');

    return { stars, newBadges, newAnimals: newAnimalIds };
  },
};
