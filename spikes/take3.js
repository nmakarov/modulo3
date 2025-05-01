const { verifyInput, verifyStates, makeStateMachine } = require("../library/StateMachine.js");

// node spikes/take3.js

const alphabet = [ "0", "1" ];
const states = {
    S0: { "0": "S0", "1": "S1", result: 0 },
    S1: { "0": "S2", "1": "S0", result: 1 },
    S2: { "0": "S1", "1": "S2", result: 2 },
};

console.info("verifyStates:", verifyStates(states, alphabet));
console.info("verifyInput:", verifyInput("1101", alphabet));
const stateMachine = makeStateMachine(states, alphabet);
const bins = [
    "1101",
    "1110",
    "1111",
    "1010",
];
for (let bin of bins) {
    const state = stateMachine(bin, "S0");
    console.info(`Final state ${bin} (${parseInt(bin, 2)}) is: `, state);
}