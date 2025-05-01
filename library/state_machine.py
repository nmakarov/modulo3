def verify_input(p_input, alphabet):
    input_str = str(p_input)
    if len(input_str) == 0:
        raise ValueError("Input must not be empty")
    for i, bit in enumerate(input_str):
        if bit not in alphabet:
            raise ValueError(f'Bit "{bit}" at position {i} is not in alphabet')
    return input_str


def verify_states(p_states, alphabet):
    states = {}
    for state, transitions in p_states.items():
        if not isinstance(transitions, dict):
            raise ValueError(f"State {state} must be a dictionary")
        states[state] = {}
        has_result = False
        for bit, new_state in transitions.items():
            if bit == "result":
                states[state]["result"] = new_state
                has_result = True
                continue
            if bit not in alphabet:
                raise ValueError(f'Bit "{bit}" in state "{state}" is not in alphabet')
            if new_state not in p_states:
                raise ValueError(f'State "{new_state}" in state "{state}" is not defined')
            states[state][bit] = new_state
        if not has_result:
            raise ValueError(f'State "{state}" must have a "result"')
    return states


def make_state_machine(p_states, alphabet):
    states = verify_states(p_states, alphabet)

    def transition_fn(p_input, p_initial_state=None):
        input_str = verify_input(p_input, alphabet)
        state = p_initial_state or next(iter(states))
        for bit in input_str:
            state = states[state][bit]
        return states[state]["result"]

    return transition_fn
