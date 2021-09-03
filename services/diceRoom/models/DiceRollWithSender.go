package models

type DiceRollWithSender struct {
	Id string `json:"id,omitempty"`

	// The id of who rolled this dice roll.
	DiceRollerId string `json:"diceRollerId,omitempty"`

	// The dice notation that was used to get the result.
	DiceNotation string `json:"diceNotation,omitempty"`

	// The breakdown of how the result was calculated. Individual dice rolls are represented in arrays (within the string).
	ResultBreakdown string `json:"resultBreakdown,omitempty"`

	Result int32 `json:"result,omitempty"`
}
