import { useState, useCallback } from 'react';
import { animals, Animal } from '../../data/animals';
import { shuffle } from '../../utils/shuffle';
import { useProgressStore } from '../../store/useProgressStore';
import { audioManager } from '../../services/AudioManager';

export type MatchState = 'idle' | 'correct' | 'wrong' | 'complete';

export interface MatchPair {
  animalId: string;
  emoji: string;
  nameId: string;
  nameEn: string;
}

export function useMatchingLogic(pairCount: number) {
  const unlockedAnimals = useProgressStore((s) => s.unlockedAnimals);

  // Pilih hewan yang sudah unlock secara acak
  const initPairs = useCallback((): MatchPair[] => {
    const unlocked = animals.filter((a) => unlockedAnimals.includes(a.id));
    const selected = shuffle(unlocked).slice(0, pairCount);
    return selected.map((a) => ({
      animalId: a.id,
      emoji: a.emoji,
      nameId: a.nameId,
      nameEn: a.nameEn,
    }));
  }, [unlockedAnimals, pairCount]);

  const [pairs] = useState<MatchPair[]>(() => initPairs());

  // Shuffled silhouettes (slot targets)
  const [silhouettes] = useState<MatchPair[]>(() => shuffle([...pairs.map(p => ({...p}))]));

  // Tracking: animalId yang sudah match
  const [matched, setMatched] = useState<Set<string>>(new Set());

  // Tracking: animalId yang sedang dipilih (drag source)
  const [selected, setSelected] = useState<string | null>(null);

  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [matchState, setMatchState] = useState<MatchState>('idle');
  const [lastWrong, setLastWrong] = useState<string | null>(null);

  const isComplete = matched.size === pairs.length;

  const selectCard = useCallback((animalId: string) => {
    if (matched.has(animalId)) return;
    setSelected(animalId);
    setMatchState('idle');
    setLastWrong(null);
  }, [matched]);

  const tryMatch = useCallback((targetAnimalId: string) => {
    if (!selected) return;

    if (selected === targetAnimalId) {
      // Benar!
      const newMatched = new Set(matched);
      newMatched.add(selected);
      setMatched(newMatched);
      setSelected(null);
      setMatchState('correct');
      audioManager.playSfx('correct');

      if (newMatched.size === pairs.length) {
        setTimeout(() => setMatchState('complete'), 500);
      }
    } else {
      // Salah
      setWrongAnswers((c) => c + 1);
      setLastWrong(targetAnimalId);
      setMatchState('wrong');
      audioManager.playSfx('wrong');

      // Reset setelah animasi shake
      setTimeout(() => {
        setMatchState('idle');
        setLastWrong(null);
        setSelected(null);
      }, 800);
    }
  }, [selected, matched, pairs.length]);

  const reset = useCallback(() => {
    setMatched(new Set());
    setSelected(null);
    setWrongAnswers(0);
    setMatchState('idle');
    setLastWrong(null);
  }, []);

  return {
    pairs,
    silhouettes,
    matched,
    selected,
    wrongAnswers,
    matchState,
    lastWrong,
    isComplete,
    selectCard,
    tryMatch,
    reset,
  };
}
