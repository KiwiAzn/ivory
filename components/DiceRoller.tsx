import { Badge, Box, Input, VStack, Text, Flex, Spacer, StackDivider } from '@chakra-ui/react'
import { DiceRoll } from 'rpg-dice-roller';
import React, { useState } from 'react'

const dummyData = [
  new DiceRoll('4d6+1'),
  new DiceRoll('4d6+1'),
  new DiceRoll('4d6+1'),
]

const DiceRoller = () => {
  const [previousDiceRolls, setPreviousDiceRolls] = useState<Array<DiceRoll>>(dummyData);

  return (
    <Box>
      <Input placeholder="3d6+10"/>
      <VStack
        divider={<StackDivider/>}
        spacing={4}
        align="stretch"
      >
        {previousDiceRolls.map(({notation,total}, index) => (
          <Flex key={index} >
            <Box p='4'>
              <Badge>{notation}</Badge>
            </Box>
            <Spacer/>
            <Box p='4'>
              <Text>{total}</Text>
            </Box>
          </Flex>
        ))}
      </VStack>
    </Box>
  )
}
export default DiceRoller
