import { Box, Flex, Stat, StatLabel, StatNumber } from "@chakra-ui/react";
import { FunctionComponent, useEffect, useState } from "react";
import { FormattedMessage, FormattedNumber } from "react-intl";
import { animated, useSpringRef, useTransition } from "react-spring";

interface TotalDiceRollsProps {
  totalDiceRolled: number;
}

export const TotalDiceRolls: FunctionComponent<TotalDiceRollsProps> = ({
  totalDiceRolled = 0,
}) => {
  const [diceRolls, setDiceRolls] = useState([totalDiceRolled]);

  useEffect(() => {
    setDiceRolls((previousDiceRolls) => {
      return [totalDiceRolled, ...previousDiceRolls];
    });
  }, [setDiceRolls, totalDiceRolled]);

  const transRef = useSpringRef();

  const numberToDisplay = diceRolls[0];

  const transitions = useTransition(numberToDisplay, {
    ref: transRef,
    key: numberToDisplay,
    from: {
      opacity: 0,
      transform: "translate3d(0,-50%,0)",
    },
    enter: {
      opacity: 1,
      transform: "translate3d(0,0%,0)",
    },
    leave: {
      opacity: 0,
      transform: "translate3d(0,50%,0)",
    },
    onDestroyed: () => {
      setDiceRolls([totalDiceRolled]);
    },
  });

  useEffect(() => {
    transRef.start();
  }, [transRef, diceRolls]);

  console.log(diceRolls);

  return (
    <Stat>
      <StatLabel>
        <FormattedMessage
          id="stats.totalDiceRolls"
          defaultMessage="Total dice rolls"
        />
      </StatLabel>
      <StatNumber height="36px">
        {transitions((style, value) => (
          <animated.span
            style={{
              ...style,
              position: "absolute",
            }}
          >
            <FormattedNumber value={value} />
          </animated.span>
        ))}
      </StatNumber>
    </Stat>
  );
};
