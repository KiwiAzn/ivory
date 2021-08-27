import DiceRoller from './DiceRoller';
import {render, screen} from './TestUtils';
import userEvent from '@testing-library/user-event';

jest.mock('./atoms');

const originalError = global.console.error;
beforeAll(() => {
	global.console.error = jest.fn((...args) => {
		if (typeof args[0] === 'string' && args[0].includes('a test was not wrapped in act')) {
	      return
	    }
	    return originalError.call(console, args)
	});
});

afterAll(() => {
  (global.console.error as jest.Mock).mockRestore();
});

describe('Given a valid dice notation', () => {
  const diceNotation = '3d6+3';
  describe('when typed into the input field and enter is pressed', () => {
    beforeEach(() => {
      render(<DiceRoller/>);
      userEvent.type(screen.getByRole('textbox'), diceNotation + '{enter}');            
    })

    test('then the notation is displayed in the input field', () => {
      expect(screen.getByRole('textbox')).toHaveValue(diceNotation);
    }); 
    
    test('then a new die is rolled', () => {
      expect(screen.getAllByRole('listitem')).toHaveLength(1);
    })
  });

  describe('when typed into the input field and the roll button is pressed', () => {
    beforeEach(() => {
      render(<DiceRoller/>);
      userEvent.type(screen.getByRole('textbox'), diceNotation);
      userEvent.click(screen.getByRole('button'));          
    })

    test('then the notation is displayed in the input field', () => {
      expect(screen.getByRole('textbox')).toHaveValue(diceNotation);
    }); 
    
    test('then a new die is rolled', () => {
      expect(screen.getAllByRole('listitem')).toHaveLength(1);
    })
  });
});

describe('Given an invalid dice notation', () => {
  const diceNotation = '3d6-';
  describe('when typed into the input field and enter is pressed', () => {
    beforeEach(() => {
      render(<DiceRoller/>);
      userEvent.type(screen.getByRole('textbox'), diceNotation + '{enter}');            
    });

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
