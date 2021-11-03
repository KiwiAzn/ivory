package models

import "time"

type DiceRoll struct {
	// The name of who rolled this dice roll.
	RollerName string `json:"rollerName,omitempty"`

	// The dice notation that was used to get the result.
	Notation string `json:"notation,omitempty"`

	// The breakdown of how the result was calculated. Individual dice rolls are represented in arrays (within the string).
	ResultBreakdown string `json:"resultBreakdown,omitempty"`

	Result int32 `json:"result,omitempty"`

	RolledAt time.Time `json:"rolledAt,omitempty"`
}
