package main

// go run spikes/take3.go

import (
	"fmt"

	"modulo3/library"
)

func main() {
	alphabet := library.Alphabet{"0", "1"}

	states := library.States[int]{
		"S0": {Transitions: map[string]string{"0": "S0", "1": "S1"}, Result: library.Ptr(0)},
		"S1": {Transitions: map[string]string{"0": "S2", "1": "S0"}, Result: library.Ptr(1)},
		"S2": {Transitions: map[string]string{"0": "S1", "1": "S2"}, Result: library.Ptr(2)},
	}

	err := library.VerifyStates(states, alphabet)
	if err != nil {
		panic(err)
	}

	fsm := library.MakeStateMachine(states, alphabet)

	bins := []string{"1101", "1110", "1111", "1010"}

	for _, bin := range bins {
		result, err := fsm(bin, "S0")
		if err != nil {
			fmt.Printf("Error for %s: %v\n", bin, err)
			continue
		}
		fmt.Printf("Final state %s is: %d\n", bin, result)
	}
}
