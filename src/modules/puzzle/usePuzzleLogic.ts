import { useState, useCallback } from 'react';
import { shuffle } from '../../utils/shuffle';

export interface PuzzlePiece {
  id: number;
  correctSlot: number;
  row: number;
  col: number;
}

export function usePuzzleLogic(totalPieces: 4 | 6) {
  const cols = totalPieces === 4 ? 2 : 3;
  const rows = totalPieces === 4 ? 2 : 2;

  const makePieces = (): PuzzlePiece[] => {
    const pieces: PuzzlePiece[] = Array.from({ length: totalPieces }, (_, i) => ({
      id: i,
      correctSlot: i,
      row: Math.floor(i / cols),
      col: i % cols,
    }));
    return shuffle(pieces);
  };

  const [trayPieces, setTrayPieces] = useState<PuzzlePiece[]>(() => makePieces());
  const [filledSlots, setFilledSlots] = useState<Map<number, PuzzlePiece>>(new Map());
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // selectedPiece masih ada untuk kompatibilitas tap-based (tidak dipakai di DnD)
  const [selectedPiece, setSelectedPiece] = useState<PuzzlePiece | null>(null);

  const isComplete = filledSlots.size === totalPieces;

  const selectPiece = useCallback((piece: PuzzlePiece) => {
    setSelectedPiece((prev) => prev?.id === piece.id ? null : piece);
  }, []);

  /**
   * Coba tempatkan `piece` ke `slotIndex`.
   * Jika piece tidak diberikan, pakai selectedPiece.
   * Return true jika benar, false jika salah.
   */
  const tryPlaceInSlot = useCallback(
    (slotIndex: number, piece?: PuzzlePiece): boolean => {
      const target = piece ?? selectedPiece;
      if (!target) return false;
      if (filledSlots.has(slotIndex)) return false;

      if (target.correctSlot === slotIndex) {
        setFilledSlots((prev) => {
          const next = new Map(prev);
          next.set(slotIndex, target);
          return next;
        });
        setTrayPieces((prev) => prev.filter((p) => p.id !== target.id));
        setSelectedPiece(null);
        return true;
      } else {
        setSelectedPiece(null);
        return false;
      }
    },
    [selectedPiece, filledSlots]
  );

  const useHint = useCallback(() => {
    setHintsUsed((h) => h + 1);
    setShowHint(true);
    setTimeout(() => setShowHint(false), 3000);
  }, []);

  const reset = useCallback(() => {
    setTrayPieces(makePieces());
    setFilledSlots(new Map());
    setSelectedPiece(null);
    setHintsUsed(0);
    setShowHint(false);
  }, [totalPieces]);

  return {
    trayPieces,
    filledSlots,
    selectedPiece,
    hintsUsed,
    showHint,
    isComplete,
    cols,
    rows,
    selectPiece,
    tryPlaceInSlot,
    useHint,
    reset,
  };
}
