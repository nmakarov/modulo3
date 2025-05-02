import {
    verifyInput,
    verifyStates,
    makeStateMachine,
    Alphabet,
    States
} from "../library/StateMachineTS";

describe("TS verifyInput", () => {
    const alphabet: Alphabet = ["0", "1"];

    it("should return the same string if valid", () => {
        expect(verifyInput("1010", alphabet)).toBe("1010");
    });

    it("should throw if input contains invalid characters", () => {
        expect(() => verifyInput("1020", alphabet)).toThrow('Bit "2" at position 2 is not in alphabet');
    });

    it("should throw if input is empty", () => {
        expect(() => verifyInput("", alphabet)).toThrow("Input must not be empty");
    });

    it("should convert numeric input to string", () => {
        expect(verifyInput(101, alphabet)).toBe("101");
    });
});

describe("verifyStates", () => {
    const alphabet: Alphabet = ["0", "1"];

    it("should validate proper state definitions", () => {
        const states: States<string> = {
            S0: { "0": "S0", "1": "S1", result: "A" },
            S1: { "0": "S2", "1": "S0", result: "B" },
            S2: { "0": "S1", "1": "S2", result: "C" }
        };
        expect(() => verifyStates(states, alphabet)).not.toThrow();
    });

    it("should throw if a transition points to an undefined state", () => {
        const badStates: States<string> = {
            S0: { "0": "S1", result: "A" }
        };
        expect(() => verifyStates(badStates, alphabet)).toThrow('State "S1" in state "S0" is not defined');
    });

    it("should throw if result key is missing", () => {
        const badStates: any = {
            S0: { "0": "S0", "1": "S0" }
        };
        expect(() => verifyStates(badStates, alphabet)).toThrow('State "S0" must have a "result"');
    });
});

describe("makeStateMachine", () => {
    const alphabet: Alphabet = ["0", "1"];
    const states: States<string> = {
        S0: { "0": "S0", "1": "S1", result: "A" },
        S1: { "0": "S2", "1": "S0", result: "B" },
        S2: { "0": "S1", "1": "S2", result: "C" }
    };
    const fsm = makeStateMachine(states, alphabet);

    it("should compute the correct result from a binary string", () => {
        expect(fsm("011", "S0")).toBe("A");
        expect(fsm("01", "S0")).toBe("B");
        expect(fsm("010", "S0")).toBe("C");
    });

    it("should throw for invalid input character", () => {
        expect(() => fsm("012", "S0")).toThrow('Bit "2" at position 2 is not in alphabet');
    });
});
