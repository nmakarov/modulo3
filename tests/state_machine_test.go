package tests

import (
	"testing"

	"modulo3/library"
)

func TestVerifyInput(t *testing.T) {
	alphabet := library.Alphabet{"0", "1"}

	_, err := library.VerifyInput("102", alphabet)
	if err == nil {
		t.Error("Expected error for invalid input")
	}

	_, err = library.VerifyInput("", alphabet)
	if err == nil {
		t.Error("Expected error for empty input")
	}

	val, err := library.VerifyInput("1010", alphabet)
	if err != nil || val != "1010" {
		t.Error("Valid input failed")
	}
}

func TestVerifyStates(t *testing.T) {
	alphabet := library.Alphabet{"0", "1"}

	goodStates := library.States[string]{
		"S0": {Transitions: map[string]string{"0": "S0", "1": "S1"}, Result: library.Ptr("A")},
		"S1": {Transitions: map[string]string{"0": "S2", "1": "S0"}, Result: library.Ptr("B")},
		"S2": {Transitions: map[string]string{"0": "S1", "1": "S2"}, Result: library.Ptr("C")},
	}

	if err := library.VerifyStates(goodStates, alphabet); err != nil {
		t.Errorf("Expected valid states, got error: %v", err)
	}

	badStates := library.States[string]{
		"S0": {Transitions: map[string]string{"0": "S1"}, Result: nil},
	}

	if err := library.VerifyStates(badStates, alphabet); err == nil {
		t.Error("Expected error for missing result or undefined state")
	}
}

func TestMakeStateMachine(t *testing.T) {
	alphabet := library.Alphabet{"0", "1"}

	states := library.States[string]{
		"S0": {Transitions: map[string]string{"0": "S0", "1": "S1"}, Result: library.Ptr("A")},
		"S1": {Transitions: map[string]string{"0": "S2", "1": "S0"}, Result: library.Ptr("B")},
		"S2": {Transitions: map[string]string{"0": "S1", "1": "S2"}, Result: library.Ptr("C")},
	}

	fsm := library.MakeStateMachine(states, alphabet)

	result, err := fsm("011", "S0")
	if err != nil || result != "A" {
		t.Errorf("Expected result 'A', got %v (err: %v)", result, err)
	}

	_, err = fsm("012", "S0")
	if err == nil {
		t.Error("Expected error for invalid input character")
	}
}
