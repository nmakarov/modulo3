// node spikes/take2.js

/*
states:
S0(0) -> S0
S0(1) -> S1
S1(0) -> S2
S1(1) -> S0
S2(0) -> S1
S2(1) -> S2
*/


const states = {
    S0: { "0": "S0", "1": "S1" },
    S1: { "0": "S2", "1": "S0" },
    S2: { "0": "S1", "1": "S2" },
};

function stateMachine(input, states) {
    if (typeof input !== "string") {
        throw new Error("Input must be a string");
    }
    if (!/^[01]+$/.test(input)) {
        throw new Error("Input must be a binary string");
    }
    let state = "S0";
    console.info(`State0: ${state}`);
    for (let bit of input) {
        state = states[state][bit];
        console.info(`Input: ${bit} -> State: ${state}`);
    }
    console.info(`Final state: ${state}`);
    return Object.keys(states).indexOf(state);
}

const bins = [
    "1101",
    "1110",
    "1111",
    "1010",
];
for (let bin of bins) {
    const state = stateMachine(bin, states);
    console.info(`Final state ${bin} is: `, state);
}
