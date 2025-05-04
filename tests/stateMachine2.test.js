const { StateMachine } = require("../library/StateMachine2");
const {
    buildRulesetSchema,
    validateRuleset: customValidator
 } = require("../library/customValidator");

describe("Verify ruleset", () => {
    describe("Green tests", () => {
        it("should verify ruleset", () => {
            const ruleset = {
                S0: { "0": "S0", "1": "S1" },
                S1: { "0": "S2", "1": "S0" },
                S2: { "0": "S1", "1": "S2" }
            };
            expect(StateMachine.verifyRuleSet(ruleset)).toEqual(ruleset);
        });
    });
    describe("Red tests", () => {
        it("should throw error on no ruleset", () => {
            const ruleset = null;
            expect(() => StateMachine.verifyRuleSet(ruleset)).toThrow("No ruleset defined");
        });        it("should throw error on empty ruleset", () => {
            const ruleset = {};
            expect(() => StateMachine.verifyRuleSet(ruleset)).toThrow("Ruleset has no rules");
        });
        it("should throw error on non-object ruleset", () => {
            const ruleset = 123;
            expect(() => StateMachine.verifyRuleSet(ruleset)).toThrow("Ruleset must be an object");
        });
        it("should throw error if a rule is not an object", () => {
            const ruleset = {
                S0: { "0": "S0", "1": "S1" },
                S1: 22,
                S2: { "0": "S1", "1": "S2" }
            };
            expect(() => StateMachine.verifyRuleSet(ruleset)).toThrow("State \"S1\" must be an object");
        });    it("should throw error on empty state set", () => {
            const ruleset = {
                S0: {},
                S1: {},
                S2: {}
            };
            expect(() => StateMachine.verifyRuleSet(ruleset)).toThrow("State \"S0\" must have at least one transition");
        });
        it("should throw error if newState is not a string", () => {
            const ruleset = {
                S0: { "0": 12, "1": "S1" },
                S1: { "0": "S2", "1": "S0" },
            };
            expect(() => StateMachine.verifyRuleSet(ruleset)).toThrow("State \"S0/0\" must have a string as a new state");
        });
        it("should throw error if newState is not a string", () => {
            const ruleset = {
                S0: { "0": "S3", "1": "S1" },
                S1: { "0": "S2", "1": "S0" },
            };
            expect(() => StateMachine.verifyRuleSet(ruleset)).toThrow("New state \"S3\" in state \"S0/0\" has no coresponding entry in ruleset");
        });
    });
});
describe("Figure out params", () => {
    const ruleset = {
        S0: { "0": "S0", "1": "S1" },
        S1: { "0": "S2", "1": "S0" },
        S2: { "0": "S1", "1": "S2" }
    };
    // greens
    it("should gifure out state set", () => {
        expect(StateMachine.figureOutStateSet(ruleset)).toEqual([ "S0", "S1", "S2" ]);
    });
    
    it("should gifure out alphabet", () => {
        expect(StateMachine.figureOutAlphabet(ruleset)).toEqual([ "0", "1" ]);
    });

    it("should gifure out initial state", () => {
        expect(StateMachine.figureOutInitialState(ruleset)).toEqual("S0");
    });
});

describe("Verify input", () => {
    const ruleset = {
        S0: { "0": "S0", "1": "S1" },
        S1: { "0": "S2", "1": "S0" },
        S2: { "0": "S1", "1": "S2" }
    };
    const alphabet = StateMachine.figureOutAlphabet(ruleset);
    // greens
    it("should verify input", () => {
        expect(StateMachine.verifyInput("010101", alphabet)).toEqual("010101");
    });
    it("should throw error on empty input", () => {
        expect(() => StateMachine.verifyInput(undefined, alphabet)).toThrow("No input defined");
    });
    it("should throw error on empty input", () => {
        expect(() => StateMachine.verifyInput("", alphabet)).toThrow("No input defined");
    });
    it("should throw error on non-string input", () => {
        expect(() => StateMachine.verifyInput(123, alphabet)).toThrow("Input must be a string");
    });
    it("should throw error on non-string input", () => {
        expect(() => StateMachine.verifyInput([], alphabet)).toThrow("Input must be a string");
    });
    it("should throw error on empty alphabet", () => {
        expect(() => StateMachine.verifyInput("010101", [])).toThrow("Alphabet must not be empty");
    });
    it("should throw error on non-array alphabet", () => {
        expect(() => StateMachine.verifyInput("010101", "0123456789")).toThrow("Alphabet must be an array");
    });
    it("should throw error on non-string alphabet", () => {
        expect(() => StateMachine.verifyInput("010101", [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ])).toThrow("Alphabet must be an array of strings");
    });
    it("should throw error on a bit not found in alphabet", () => {
        expect(() => StateMachine.verifyInput("010201", [ "0", "1" ])).toThrow("Bit \"2\" at position 3 is not in alphabet");
    });
});

describe("StateMachine", () => {
    const ruleset = {
        S0: { "0": "S0", "1": "S1" },
        S1: { "0": "S2", "1": "S0" },
        S2: { "0": "S1", "1": "S2" }
    };
    describe("Sanity tests", () => {
        const input = "010101";
        const sm = new StateMachine(ruleset, { input });
        // greens
        it("should create a state machine", () => {
            expect(sm).toBeInstanceOf(StateMachine);
        });
        it("should prepare input", () => {
            const input = "010101";
            expect(sm.input).toEqual(input);
        });
        it("should resolve result", () => {
            expect(sm.resolveResult("S0")).toEqual("0");
            expect(sm.resolveResult("S1")).toEqual("1");
            expect(sm.resolveResult("S2")).toEqual("2");
        });
        it("should reset state machine", () => {
            expect(sm.currentState).toEqual("S0");
            expect(sm.stateHistory).toEqual([ ]);
        });
        it("should step through input", () => {
            expect(sm.step("0")).toEqual("S0");
            expect(sm.step("1")).toEqual("S1");
            expect(sm.step("0")).toEqual("S2");
            expect(sm.step("1")).toEqual("S2");
            expect(sm.step("0")).toEqual("S1");
            expect(sm.step("1")).toEqual("S0");
        });
        it("should go through input", () => {
            expect(sm.go(input)).toEqual("0");
        });
    });
    describe("Acceptance tests", () => {
        const ruleset = {
            S0: { "0": "S0", "1": "S1" },
            S1: { "0": "S2", "1": "S0" },
            S2: { "0": "S1", "1": "S2" }
        };
        const sm = new StateMachine(ruleset);

        beforeEach(() => {
            sm.reset();
        });
        it("should accept input", () => {
            const input = "1010";
            expect(sm.go(input)).toEqual("1");
            console.info(sm.stateHistory);
            expect(sm.getStateHistory()).toEqual("S0 -> S1(1) -> S2(0) -> S2(1) -> S1(0)");
        });
    });
    describe("Alphabet tests", () => {
        const ruleset = {
            S0: { "0": "S0", "1": "S1" },
            S1: { "0": "S2", "1": "S0" },
            S2: { "0": "S1", "1": "S2" }
        };
        const sm = new StateMachine(ruleset);
        // greens
        it("should verify alphabet", () => {
            const alphabet = [ "0", "1" ];
            expect(sm.verifyAlphabet(alphabet)).toEqual(alphabet);
        });
        it("should throw error on empty alphabet", () => {
            expect(() => sm.verifyAlphabet([])).toThrow("Alphabet must not be empty");
        });
        it("should throw error on non-array alphabet", () => {
            expect(() => sm.verifyAlphabet("0123456789")).toThrow("Alphabet must be an array");
        });
        it("should throw error on non-string alphabet", () => {
            expect(() => sm.verifyAlphabet([ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ])).toThrow("Alphabet must be an array of strings");
        });
        it("Should throw if ruleset has a wrong bit", () => {
            const ruleset = {
                S0: { "0": "S0", "1": "S1" },
                S1: { "0": "S2", "2": "S0" },
                S2: { "0": "S1", "1": "S2" }
            };
            const alphabet = [ "0", "1" ];
            expect(() => new StateMachine(ruleset, { alphabet })).toThrow("Bit \"2\" in state \"S1\" is not in alphabet");
        });
        it("Should not immediately throw if a wrong bit is in the supplied aplhabet", () => {
            // quite rare case, but nonetheless...
            const ruleset = {
                S0: { "0": "S0", "1": "S1" },
                S1: { "0": "S2", "1": "S0" },
                S2: { "0": "S1", "1": "S2" }
            };
            const alphabet = [ "0", "1", "2" ];
            const input = "120";
            expect(() => new StateMachine(ruleset, { input, alphabet })).not.toThrow();
            const sm = new StateMachine(ruleset, { input, alphabet });
            expect(() => sm.go(input)).toThrow("Bit \"2\" leads nowhere");
        });
    });
});

describe("Custom validator", () => {
    const alphabet = [ "0", "1" ];
    const ruleset = {
        S0: { "0": "S0", "1": "S1" },
        S1: { "0": "S2", "1": "S0" },
        S2: { "0": "S1", "1": "S2" }
    };
    // greens
    it("should build ruleset schema", () => {
        const schema = buildRulesetSchema(alphabet);
        expect(schema).toBeDefined();
    });
    it("should validate ruleset", () => {
        const result = customValidator(ruleset, alphabet);
        expect(result).toEqual(ruleset);
    });
    it("should throw error on empty ruleset", () => {
        expect(() => customValidator({}, alphabet)).toThrow();
    });
    it("should throw error on empty ruleset", () => {
        expect(() => customValidator(null, alphabet)).toThrow();
    });
    it("should throw if bit is outside of alphabet", () => {
        const ruleset = {
            S0: { "0": "S0", "1": "S1" },
            S1: { "0": "S2", "2": "S0" },
            S2: { "0": "S1", "1": "S2" }
        };
        expect(() => customValidator(ruleset, alphabet)).toThrow();
    });
    it("should throw if newState is not defined on the top level", () => {
        const ruleset = {
            S0: { "0": "S0", "1": "S1" },
            S1: { "0": "S2", "1": "S0" },
            S2: { "0": "S1", "1": "S3" }
        };
        expect(() => customValidator(ruleset, alphabet)).toThrow();
    });
    it("should throw if custom validator not a function", () => {
        const ruleset = {
            S0: { "0": "S0", "1": "S1" },
            S1: { "0": "S2", "1": "S0" },
            S2: { "0": "S1", "1": "S2" }
        };
        expect(() => new StateMachine(ruleset, { validator: 123 })).toThrow("'validator' must be a function");
        expect(() => new StateMachine(ruleset, { validator: customValidator })).toThrow("'alphabet' must be defined if 'validator' is defined");
        
    });
    it("should work if a custom validator is used", () => {
        const ruleset = {
            S0: { "0": "S0", "1": "S1" },
            S1: { "0": "S2", "1": "S0" },
            S2: { "0": "S1", "1": "S2" }
        };
        const input = "1010";
        const sm = new StateMachine(ruleset, { validator: customValidator, alphabet });

        expect(sm).toBeInstanceOf(StateMachine);
        expect(sm.go(input)).toEqual("1");
        expect(sm.getStateHistory()).toEqual("S0 -> S1(1) -> S2(0) -> S2(1) -> S1(0)");
    });
});