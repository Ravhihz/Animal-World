export interface Badge {
  id: string;
  nameId: string;
  nameEn: string;
  emoji: string;
  descriptionId: string;
  descriptionEn: string;
  iconAsset: string;
  condition: {
    type: 'stars' | 'unlock_count' | 'activity_count' | 'specific_activity';
    value: number;
    activityType?: 'matching' | 'puzzle' | 'coloring' | 'animals';
  };
}

export const badges: Badge[] = [
  {
    id: 'first_star',
    nameId: 'Bintang Pertama',
    nameEn: 'First Star',
    emoji: '⭐',
    descriptionId: 'Dapatkan bintang pertamamu!',
    descriptionEn: 'Earn your first star!',
    iconAsset: 'assets/badges/first_star.png',
    condition: { type: 'stars', value: 1 },
  },
  {
    id: 'star_collector',
    nameId: 'Pengumpul Bintang',
    nameEn: 'Star Collector',
    emoji: '🌟',
    descriptionId: 'Kumpulkan 10 bintang',
    descriptionEn: 'Collect 10 stars',
    iconAsset: 'assets/badges/star_collector.png',
    condition: { type: 'stars', value: 10 },
  },
  {
    id: 'star_master',
    nameId: 'Maestro Bintang',
    nameEn: 'Star Master',
    emoji: '✨',
    descriptionId: 'Kumpulkan 50 bintang',
    descriptionEn: 'Collect 50 stars',
    iconAsset: 'assets/badges/star_master.png',
    condition: { type: 'stars', value: 50 },
  },
  {
    id: 'animal_lover',
    nameId: 'Pecinta Hewan',
    nameEn: 'Animal Lover',
    emoji: '🐾',
    descriptionId: 'Buka 5 hewan baru',
    descriptionEn: 'Unlock 5 new animals',
    iconAsset: 'assets/badges/animal_lover.png',
    condition: { type: 'unlock_count', value: 5 },
  },
  {
    id: 'animal_expert',
    nameId: 'Ahli Hewan',
    nameEn: 'Animal Expert',
    emoji: '🏆',
    descriptionId: 'Kumpulkan 10 hewan',
    descriptionEn: 'Collect 10 animals',
    iconAsset: 'assets/badges/animal_expert.png',
    condition: { type: 'unlock_count', value: 10 },
  },
  {
    id: 'puzzle_master',
    nameId: 'Jago Puzzle',
    nameEn: 'Puzzle Master',
    emoji: '🧩',
    descriptionId: 'Selesaikan 5 puzzle',
    descriptionEn: 'Complete 5 puzzles',
    iconAsset: 'assets/badges/puzzle_master.png',
    condition: { type: 'specific_activity', value: 5, activityType: 'puzzle' },
  },
  {
    id: 'matching_star',
    nameId: 'Bintang Cocokkan',
    nameEn: 'Matching Star',
    emoji: '🎯',
    descriptionId: 'Selesaikan 5 permainan Cocokkan',
    descriptionEn: 'Complete 5 matching games',
    iconAsset: 'assets/badges/matching_star.png',
    condition: { type: 'specific_activity', value: 5, activityType: 'matching' },
  },
  {
    id: 'artist',
    nameId: 'Seniman Cilik',
    nameEn: 'Little Artist',
    emoji: '🎨',
    descriptionId: 'Warnai 5 gambar hewan',
    descriptionEn: 'Color 5 animal pictures',
    iconAsset: 'assets/badges/artist.png',
    condition: { type: 'specific_activity', value: 5, activityType: 'coloring' },
  },
];

export const getBadgeById = (id: string): Badge | undefined =>
  badges.find((b) => b.id === id);
