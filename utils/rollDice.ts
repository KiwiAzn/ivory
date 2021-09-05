import { DiceRoll as _DiceRoll } from "rpg-dice-roller";
import { DiceRoll } from "../components/atoms";

const rollDice = (diceNotation: string): DiceRoll => {
  const newDiceRoll = new _DiceRoll(diceNotation);

  const diceRoll: DiceRoll = {
    notation: newDiceRoll.notation,
    result: newDiceRoll.total,
    resultBreakdown: newDiceRoll.rolls.join(" "),
  };

  return diceRoll;
};

export default rollDice;
