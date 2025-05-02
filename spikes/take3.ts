import {
    verifyInput,
    verifyStates,
    makeStateMachine,
    Alphabet,
    States,
} from "../library/StateMachineTS";

// npx ts-node spikes/take3.ts

const alphabet: Alphabet = ["0", "1"];

const states: States<number> = {
    S0: { "0": "S0", "1": "S1", result: 0 },
    S1: { "0": "S2", "1": "S0", result: 1 },
    S2: { "0": "S1", "1": "S2", result: 2 },
};

console.log("verifyStates:", verifyStates(states, alphabet));
console.log("verifyInput:", verifyInput("1101", alphabet));

const stateMachine = makeStateMachine(states, alphabet);

const bins = [
    "1101",
    "1110",
    "1111",
    "1010",
];

for (const bin of bins) {
    const result = stateMachine(bin, "S0");
    console.log(`Final state ${bin} (${parseInt(bin, 2)}) is:`, result);
}