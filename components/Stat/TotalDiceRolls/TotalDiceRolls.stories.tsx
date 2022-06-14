import { ComponentStory, ComponentMeta } from "@storybook/react";
import { TotalDiceRolls } from "./TotalDiceRolls";

export default {
  component: TotalDiceRolls,
  parameters: {
    layout: "centered",
  },
  args: {
    totalDiceRolled: 42,
  },
} as ComponentMeta<typeof TotalDiceRolls>;

export const TotalDiceRollsComponent: ComponentStory<typeof TotalDiceRolls> = (
  args
) => <TotalDiceRolls {...args} />;
