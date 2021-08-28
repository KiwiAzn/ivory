import { DiceRoll } from "rpg-dice-roller";
import { atom } from "jotai";

export const diceRollsAtom = atom<Array<DiceRoll>>([]);
