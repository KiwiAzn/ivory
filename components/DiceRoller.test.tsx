import DiceRoller from './DiceRoller';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event'

describe('Given a valid dice notation', () => {
  const diceNotation = '3d6+3';
  describe('when typed into the input field and enter is pressed', () => {
    beforeEach(async () => {
      render(<DiceRoller/>);

      await waitFor(() => {
        expect(screen).toBeDefined();
      })
      
      userEvent.type(screen.getByRole('textbox'), diceNotation + '{enter}');            
    })

    test('then the notation is displayed in the input field', () => {
      expect(screen.getByRole('textbox')).toHaveValue(diceNotation);
    }); 
    
    test('then a new dice is rolled', () => {
      expect(screen.getAllByRole('listitem')).toHaveLength(1);
    })
  })
});