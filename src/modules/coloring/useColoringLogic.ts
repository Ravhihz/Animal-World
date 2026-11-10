import { useState, useCallback } from 'react';

export type AreaId = string;
export type ColorMap = Map<AreaId, string>;

const COLORS = [
  '#FF6B6B', // Merah
  '#FF9F43', // Oranye
  '#FECA57', // Kuning
  '#48DBFB', // Biru muda
  '#1DD1A1', // Hijau
  '#54A0FF', // Biru
  '#5F27CD', // Ungu
  '#FF6BA6', // Pink
  '#FFFFFF', // Putih
  '#2D3436', // Hitam
];

export function useColoringLogic(totalAreas: number) {
  const [selectedColor, setSelectedColor] = useState<string>(COLORS[0]);
  const [colorMap, setColorMap] = useState<ColorMap>(new Map());
  const [history, setHistory] = useState<ColorMap[]>([]);

  const colorArea = useCallback((areaId: AreaId) => {
    setHistory((prev) => [...prev, new Map(colorMap)]);
    setColorMap((prev) => {
      const next = new Map(prev);
      next.set(areaId, selectedColor);
      return next;
    });
  }, [colorMap, selectedColor]);

  const undo = useCallback(() => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setColorMap(prev);
    setHistory((h) => h.slice(0, -1));
  }, [history]);

  const reset = useCallback(() => {
    setHistory([new Map(colorMap)]);
    setColorMap(new Map());
  }, [colorMap]);

  const getColoredPercent = useCallback((): number => {
    if (totalAreas === 0) return 0;
    return Math.round((colorMap.size / totalAreas) * 100);
  }, [colorMap, totalAreas]);

  const canUndo = history.length > 0;

  return {
    colors: COLORS,
    selectedColor,
    colorMap,
    canUndo,
    setSelectedColor,
    colorArea,
    undo,
    reset,
    getColoredPercent,
  };
}
