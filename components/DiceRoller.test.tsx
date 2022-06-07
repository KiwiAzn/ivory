import DiceRoller from "./DiceRoller";
import { act, render, screen, waitFor } from "./TestUtils";
import userEvent from "@testing-library/user-event";

jest.mock("./atoms");

describe("Given a valid dice notation", () => {
  const diceNotation = "3d6+3";
  describe("when typed into the input field and enter is pressed", () => {
    beforeEach(async () => {
      render(<DiceRoller />);

      await act(() => {
        userEvent.type(screen.getByRole("textbox"), diceNotation + "{enter}");
      });
    });

    test("then the notation is displayed in the input field", async () => {
      await waitFor(() =>
        expect(screen.getByRole("textbox")).toHaveValue(diceNotation)
      );
    });

    test("then a new die is rolled", async () => {
      await waitFor(() =>
        expect(screen.getAllByRole("listitem")).toHaveLength(1)
      );
    });
  });

  describe("when typed into the input field and the roll button is pressed", () => {
    beforeEach(async () => {
      render(<DiceRoller />);
      await act(async () => {
        await userEvent.type(screen.getByRole("textbox"), diceNotation);
        userEvent.click(screen.getByText("Roll"));
      });
    });

    test("then the notation is displayed in the input field", async () => {
      await waitFor(() =>
        expect(screen.getByRole("textbox")).toHaveValue(diceNotation)
      );
    });

    test("then a new die is rolled", async () => {
      await waitFor(() =>
        expect(screen.getAllByRole("listitem")).toHaveLength(1)
      );
    });
  });
});

describe("Given an invalid dice notation", () => {
  const diceNotation = "3d6-";
  describe("when typed into the input field and enter is pressed", () => {
    beforeEach(async () => {
      render(<DiceRoller />);
      await act(async () => {
        userEvent.type(screen.getByRole("textbox"), diceNotation + "{enter}");
      });
    });

    test("then the notation is displayed in the input field", async () => {
      await waitFor(() =>
        expect(screen.getByRole("textbox")).toHaveValue(diceNotation)
      );
    });

    test("then no new die is rolled", async () => {
      await waitFor(() =>
        expect(screen.queryAllByRole("listitem")).toHaveLength(0)
      );
    });

    test("then show helper text", async () => {
      await waitFor(() =>
        expect(screen.getByText("Please enter a valid dice notation"))
      );
    });
  });
});
