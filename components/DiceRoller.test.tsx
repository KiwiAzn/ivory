import DiceRoller from './DiceRoller';
import {render, screen, waitFor} from './TestUtils';
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
    
    test('then a new die is rolled', () => {
      expect(screen.getAllByRole('listitem')).toHaveLength(1);
    })
  })
});

describe('Given an invalid dice notation', () => {
  const diceNotation = '3d6-';
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
    
    test('then no new die is rolled', () => {
      expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    });

    test('then show helper text', () => {
      expect(screen.getByText('Please enter a valid dice notation'));
    })
  });  
});
