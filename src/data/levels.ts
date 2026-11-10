// ── MATCHING LEVELS ─────────────────────────────────────────────────────────

export interface MatchingLevel {
  id: string;
  nameId: string;
  nameEn: string;
  pairCount: number;        // Jumlah pasang soal
  timeBonus: boolean;       // apakah ada time bonus? (belum dipakai MVP)
}

export const matchingLevels: MatchingLevel[] = [
  { id: 'easy',   nameId: 'Mudah',  nameEn: 'Easy',   pairCount: 2, timeBonus: false },
  { id: 'medium', nameId: 'Sedang', nameEn: 'Medium', pairCount: 3, timeBonus: false },
  { id: 'hard',   nameId: 'Sulit',  nameEn: 'Hard',   pairCount: 4, timeBonus: false },
];

// ── PUZZLE LEVELS ────────────────────────────────────────────────────────────

export interface PuzzleLevel {
  id: string;
  nameId: string;
  nameEn: string;
  pieces: 4 | 6;
  gridRows: number;
  gridCols: number;
}

export const puzzleLevels: PuzzleLevel[] = [
  { id: 'easy', nameId: '4 Potongan', nameEn: '4 Pieces', pieces: 4, gridRows: 2, gridCols: 2 },
  { id: 'hard', nameId: '6 Potongan', nameEn: '6 Pieces', pieces: 6, gridRows: 2, gridCols: 3 },
];

// ── STAR CALCULATION THRESHOLDS ──────────────────────────────────────────────

export const starThresholds = {
  matching: {
    one:   { maxWrong: Infinity }, // selesai saja
    two:   { maxWrong: 3 },        // selesai dengan max 3 salah
    three: { maxWrong: 0 },        // selesai, 0 salah
  },
  puzzle: {
    one:   { maxHints: Infinity }, // selesai saja
    two:   { maxHints: 1 },        // selesai, max 1 hint
    three: { maxHints: 0 },        // selesai tanpa hint
  },
  coloring: {
    one:   { minPercent: 0 },      // selesai bebas
    two:   { minPercent: 70 },     // warnai > 70% area
    three: { minPercent: 90 },     // warnai > 90% area
  },
};
