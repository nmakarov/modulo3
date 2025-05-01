from library.state_machine import verify_input, verify_states, make_state_machine

# python3 -m spikes.take3

alphabet = ["0", "1"]
states = {
    "S0": { "0": "S0", "1": "S1", "result": 0 },
    "S1": { "0": "S2", "1": "S0", "result": 1 },
    "S2": { "0": "S1", "1": "S2", "result": 2 },
}

print("verifyStates:", verify_states(states, alphabet))
print("verifyInput:", verify_input("1101", alphabet))

state_machine = make_state_machine(states, alphabet)

bins = [
    "1101",
    "1110",
    "1111",
    "1010",
]

for bin_str in bins:
    state = state_machine(bin_str, "S0")
    print(f"Final state {bin_str} ({int(bin_str, 2)}) is:", state)
