import { DiceRoll } from "rpg-dice-roller";
import { atom } from 'jotai';

export const diceNotationHistoryAtom = atom<Record<string, number>>({});
diceNotationHistoryAtom.onMount = (setAtom) => {
    setAtom({});
};

export const diceRollsAtom = atom<Array<DiceRoll>>([]);
diceRollsAtom.onMount = (setAtom) => {
    setAtom([]);
};
