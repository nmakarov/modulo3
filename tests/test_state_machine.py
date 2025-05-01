import pytest
from library.state_machine import verify_input, verify_states, make_state_machine

alphabet = ["0", "1"]

def test_verify_input_valid():
    assert verify_input("1010", alphabet) == "1010"

def test_verify_input_invalid_char():
    with pytest.raises(ValueError, match=r'Bit "2" at position 2 is not in alphabet'):
        verify_input("1020", alphabet)

def test_verify_input_empty():
    with pytest.raises(ValueError, match="Input must not be empty"):
        verify_input("", alphabet)

def test_verify_input_number():
    assert verify_input(101, alphabet) == "101"


def test_verify_states_valid():
    states = {
        "S0": {"0": "S0", "1": "S1", "result": "A"},
        "S1": {"0": "S2", "1": "S0", "result": "B"},
        "S2": {"0": "S1", "1": "S2", "result": "C"},
    }
    assert verify_states(states, alphabet)


def test_verify_states_missing_result():
    states = {
        "S0": {"0": "S1"},
        "S1": {}
    }
    with pytest.raises(ValueError, match='State "S0" must have a "result"'):
        verify_states(states, alphabet)

def test_verify_states_invalid_transition_state():
    states = {
        "S0": {"0": "S1", "result": "A"}
    }
    with pytest.raises(ValueError, match='State "S1" in state "S0" is not defined'):
        verify_states(states, alphabet)


def test_make_state_machine_result():
    states = {
        "S0": {"0": "S0", "1": "S1", "result": "0"},
        "S1": {"0": "S2", "1": "S0", "result": "1"},
        "S2": {"0": "S1", "1": "S2", "result": "2"},
    }
    fsm = make_state_machine(states, alphabet)
    assert fsm("011") == "0"  # S0 → S1 → S0
    assert fsm("01") == "1"   # S0 → S1
    assert fsm("010") == "2"  # S0 → S1 → S2
    assert fsm("1101") == "1"  # S0 → S1 → S0 → S1 → B


def test_make_state_machine_invalid_input():
    states = {
        "S0": {"0": "S0", "1": "S1", "result": "0"},
        "S1": {"0": "S2", "1": "S0", "result": "1"},
        "S2": {"0": "S1", "1": "S2", "result": "2"},
    }
    fsm = make_state_machine(states, alphabet)
    with pytest.raises(ValueError, match='Bit "2" at position 2 is not in alphabet'):
        fsm("012", "S0")
