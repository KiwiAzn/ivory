import Dice from "./Dice";

export default {
  component: Dice,
  parameters: {
    layout: "centered",
  },
};

export const DiceComponent = () => <Dice />;
