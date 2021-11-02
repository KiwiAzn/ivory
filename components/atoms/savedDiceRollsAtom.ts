import { atomWithStorage } from "jotai/utils";

export interface SavedDiceRoll {
  name: string;
  diceNotation: string;
}

const savedDiceRollsAtom = atomWithStorage<Array<SavedDiceRoll>>(
  "savedDiceRolls",
  []
);

export default savedDiceRollsAtom;
