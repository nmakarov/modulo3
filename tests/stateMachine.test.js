const { verifyInput, verifyStates, makeStateMachine } = require("../library/StateMachine");

describe("JS verifyInput", () => {
    const alphabet = ["0", "1"];

    // Greens
    it("should return the same string if valid", () => {
        expect(verifyInput("1010", alphabet)).toBe("1010");
    });

    it("should convert numeric input to string", () => {
        expect(verifyInput(0b101, alphabet)).toBe("101");
        expect(verifyInput(9, alphabet)).toBe("1001");
    });

    // Reds
    it("should throw if input contains invalid characters", () => {
        expect(() => verifyInput("1020", alphabet)).toThrow('Bit "2" at position 2 is not in alphabet');
    });

    it("should throw if input is empty", () => {
        expect(() => verifyInput("", alphabet)).toThrow("Input must not be empty");
    });

    it("should throw if input is null or undefined", () => {
        expect(() => verifyInput(undefined, alphabet)).toThrow("Input can't be null or undefined");
    });
});

describe("verifyStates", () => {
    const alphabet = ["0", "1"];
    const states = {
        S0: { "0": "S0", "1": "S1", result: "A" },
        S1: { "0": "S2", "1": "S0", result: "B" },
        S2: { "0": "S1", "1": "S2", result: "C" }
    };
    it("should validate proper state definitions", () => {
        expect(() => verifyStates(states, alphabet)).not.toThrow();
    });

    it("should throw if alphabet is not an array", () => {
        expect(() => verifyStates(states, 23)).toThrow("Alphabet must be an array");
        expect(() => verifyStates(states, "abc")).toThrow("Alphabet must be an array");
    });

    it("should throw if alphabet is not an array of strings", () => {
        expect(() => verifyStates(states, [ 1,2,3 ])).toThrow("Alphabet must be an array of strings, but found \"1\" of type \"number\" at position 0");
    });

    it("should throw if a transition points to an undefined state", () => {
        const badStates = {
            S0: { "0": "S1", result: "A" }
        };
        expect(() => verifyStates(badStates, alphabet)).toThrow('State "S1" in state "S0" is not defined');
    });

    it("should throw if result key is missing", () => {
        const badStates = {
            S0: { "0": "S0", "1": "S0" }
        };
        expect(() => verifyStates(badStates, alphabet)).toThrow('State "S0" must have a "result"');
    });
});

describe("makeStateMachine", () => {
    const alphabet = ["0", "1"];
    const states = {
        S0: { "0": "S0", "1": "S1", result: "0" },
        S1: { "0": "S2", "1": "S0", result: "1" },
        S2: { "0": "S1", "1": "S2", result: "2" },
    };
    const fsm = makeStateMachine(states, alphabet);

    it("should use default iunitial state if not provided", () => {
        expect(fsm("1110")).toBe("2");
        expect(fsm("1110", "S0")).toBe("2"); // S0 -> S1 -> S0
    });

    it("should compute the correct result from a binary string", () => {
        expect(fsm("011")).toBe("0");
        expect(fsm("01")).toBe("1");
        expect(fsm("010")).toBe("2");
        expect(fsm("1101")).toBe("1");
        expect(fsm("1110")).toBe("2");
        expect(fsm("1111")).toBe("0");
        expect(fsm("1010")).toBe("1");
    });

    it("should throw for invalid input character", () => {
        expect(() => fsm("012", "S0")).toThrow('Bit "2" at position 2 is not in alphabet');
    });
});
