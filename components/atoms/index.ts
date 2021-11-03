import { atom } from "jotai";

export interface DiceRoll {
  rollerName?: string;
  notation: string;
  resultBreakdown: string;
  result: number;
  rolledAt: Date;
}

export const diceRollsAtom = atom<Array<DiceRoll>>([]);
