package library

import (
	"errors"
	"fmt"
)

type Alphabet []string

type StateDef[T any] struct {
	Transitions map[string]string
	Result      *T
}

type States[T any] map[string]StateDef[T]

func VerifyInput(input string, alphabet Alphabet) (string, error) {
	if len(input) == 0 {
		return "", errors.New("input must not be empty")
	}

	for i, ch := range input {
		bit := string(ch)
		if !contains(alphabet, bit) {
			return "", fmt.Errorf("bit %q at position %d is not in alphabet", bit, i)
		}
	}

	return input, nil
}

func VerifyStates[T any](states States[T], alphabet Alphabet) error {
	for stateName, stateDef := range states {
		if stateDef.Result == nil {
			return fmt.Errorf("state %q must have a result", stateName)
		}

		for bit, target := range stateDef.Transitions {
			if !contains(alphabet, bit) {
				return fmt.Errorf("bit %q in state %q is not in alphabet", bit, stateName)
			}
			if _, ok := states[target]; !ok {
				return fmt.Errorf("state %q in state %q is not defined", target, stateName)
			}
		}
	}
	return nil
}

func MakeStateMachine[T any](states States[T], alphabet Alphabet) func(input string, initial string) (T, error) {
	return func(input string, initial string) (T, error) {
		verifiedInput, err := VerifyInput(input, alphabet)
		if err != nil {
			return *new(T), err
		}

		state := initial
		for _, ch := range verifiedInput {
			bit := string(ch)
			state = states[state].Transitions[bit]
		}

		return *states[state].Result, nil
	}
}

func contains(alphabet Alphabet, s string) bool {
	for _, a := range alphabet {
		if a == s {
			return true
		}
	}
	return false
}

// Helper to take address of literal values
func Ptr[T any](v T) *T {
	return &v
}
