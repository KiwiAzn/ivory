package models

type DiceRollWithSender struct {
	// The name of who rolled this dice roll.
	DiceRollerName string `json:"diceRollerName,omitempty"`

	// The dice notation that was used to get the result.
	DiceNotation string `json:"diceNotation,omitempty"`

	// The breakdown of how the result was calculated. Individual dice rolls are represented in arrays (within the string).
	ResultBreakdown string `json:"resultBreakdown,omitempty"`

	Result int32 `json:"result,omitempty"`
}
