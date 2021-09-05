import { atom } from "jotai";

export interface DiceRoll {
  rollerName?: string;
  notation: string;
  resultBreakdown: string;
  result: number;
}

export const diceRollsAtom = atom<Array<DiceRoll>>([]);
