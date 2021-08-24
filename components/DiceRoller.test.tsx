import DiceRoller from './DiceRoller';
import {render, screen} from '@testing-library/react';

test('It does a thing', () => {
  render(<DiceRoller/>);
  expect(screen).toBeDefined();
})