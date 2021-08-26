import { DiceRoll } from "rpg-dice-roller";
import { atom } from 'jotai';

export const diceNotationHistoryAtom = atom<Record<string, number>>({});
export const diceRollsAtom = atom<Array<DiceRoll>>([]);
