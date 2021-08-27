import { atomWithLocalStorage } from "./utils";

export interface SavedDiceRoll {
  name: string;
  diceNotation: string;
}

const savedDiceRollsAtom = atomWithLocalStorage<Array<SavedDiceRoll>>(
  "savedDiceRolls",
  []
);

export default savedDiceRollsAtom;
