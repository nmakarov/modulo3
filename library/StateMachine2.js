class StateMachine {
    static verifyRuleSet(ruleset) {
        if ( ! ruleset) {
            throw new Error("No ruleset defined");
        }
        if (typeof ruleset !== "object") {
            throw new Error("Ruleset must be an object");
        }
        if ( ! Object.keys(ruleset).length) {
            throw new Error("Ruleset has no rules");
        }

        for (const [ state, rules ] of Object.entries(ruleset)) {
            if (typeof rules !== "object") {
                throw new Error(`State "${state}" must be an object`);
            }
            if (Object.keys(rules).length === 0) {
                throw new Error(`State "${state}" must have at least one transition`);
            }
            for (const [ bit, newState ] of Object.entries(rules)) {
                if (typeof newState !== "string") {
                    throw new Error(`State "${state}/${bit}" must have a string as a new state`);
                }
                if ( ! Object.keys(ruleset).includes(newState)) {
                    throw new Error(`New state "${newState}" in state "${state}/${bit}" has no coresponding entry in ruleset`);
                }
            }
            // now, in this loop the alphabet can be checked as well
            // and if every state has a transition for each bit
            // and that every state is reacheable
        }
        return ruleset;
    }
    static figureOutStateSet(ruleset) {
        const stateSet = new Set();
        for (const state of Object.keys(ruleset)) {
            // not really needed since ruleset is an object and keys are unique
            // but if ruleset is, say, and array/Map/etc., then this check is needed
            // if (stateSet.has(state)) {
            //     throw new Error(`State "${state}" is defined multiple times`);
            // }
            stateSet.add(state);
        }
        // not really needed because checks are done beforehand
        // if (stateSet.size === 0) {
        //     throw new Error("No states defined");
        // }
        return [ ...stateSet ];
    }
    static figureOutAlphabet(ruleset) {
        const alphabet = new Set();
        for (const rule of Object.values(ruleset)) {
            for (const bit of Object.keys(rule)) {
                alphabet.add(bit);
            }
        }
        return [ ...alphabet ];
    }
    static figureOutInitialState(ruleset) {
        const initialState = Object.keys(ruleset)[0];
        // not really needed because checks are done beforehand
        // if ( ! initialState) {
        //     throw new Error("No initial state defined");
        // }
        return initialState;
    }
    static verifyInput(pInput, alphabet) {
        if ( ! pInput) {
            // covers empty string as well
            throw new Error("No input defined");
        }
        if (typeof pInput !== "string") {
            throw new Error("Input must be a string");
        }
        if ( ! Array.isArray(alphabet)) {
            throw new Error("Alphabet must be an array");
        }
        if (alphabet.length === 0) {
            throw new Error("Alphabet must not be empty");
        }
        alphabet.forEach((bit, i) => {
            if (typeof bit !== "string") {
                throw new Error(`Alphabet must be an array of strings, but found "${bit}" of type "${typeof bit}" at position ${i}`);
            }
        });
        const output = pInput.split("").map((bit, i) => {
            if ( ! alphabet.includes(bit)) {
                throw new Error(`Bit "${bit}" at position ${i} is not in alphabet`);
            }
            return bit;
        }).join("");
        return output;
    }
    constructor(ruleset, { input, alphabet } = {}) {
        this.ruleset = StateMachine.verifyRuleSet(ruleset);
        this.stateSet = StateMachine.figureOutStateSet(ruleset);
        this.alphabet = alphabet ? this.verifyAlphabet(alphabet) : StateMachine.figureOutAlphabet(ruleset);
        this.initialState = StateMachine.figureOutInitialState(ruleset);
        input && this.prepare(input);
        this.reset();
    }
    verifyAlphabet(alphabet) {
        if ( ! Array.isArray(alphabet)) {
            throw new Error("Alphabet must be an array");
        }
        if (alphabet.length === 0) {
            throw new Error("Alphabet must not be empty");
        }
        alphabet.forEach((bit, i) => {
            if (typeof bit !== "string") {
                throw new Error(`Alphabet must be an array of strings, but found "${bit}" of type "${typeof bit}" at position ${i}`);
            }
        });
        for (let state of Object.keys(this.ruleset)) {
            for (let bit of Object.keys(this.ruleset[state])) {
                if ( ! alphabet.includes(bit)) {
                    throw new Error(`Bit "${bit}" in state "${state}" is not in alphabet`);
                }
            }
        }
        return alphabet;
    }
    prepare(input) {
        this.input = StateMachine.verifyInput(input, this.alphabet);
    }
    resolveResult(state) {
        return Object.keys(this.ruleset).indexOf(state).toString(10);
    }
    step(bit) {
        // if (this.position >= this.input.length) {
        //     return null;
        // }
        // const bit = this.input[this.position];
        // const stateRef = this.ruleset[this.currentState];
        // if ( ! stateRef) {
        //     throw new Error(`State "${this.currentState}" leads nowhere`);
        // }
        const newState = this.ruleset[this.currentState][bit];

        // if ( this.ruleset[this.newState] === undefined) {
        //     throw new Error(`State "${this.newState}" leads nowhere`);
        // }

        this.stateHistory.push(`${newState}(${bit})`);
        this.currentState = newState;
        return newState;
    }
    go(pInput) {
        const input = pInput ?? this.input;
        this.stateHistory.push(`${this.currentState}`);
        for (let bit of input) {
            if (this.step(bit) === undefined) {
                throw new Error(`Bit "${bit}" leads nowhere`);
            }
        }
        return this.resolveResult(this.currentState);
    }
    getStateHistory() {
        return this.stateHistory.join(" -> ");
    }
    reset() {
        this.currentState = this.initialState;
        this.stateHistory = [];
        this.position = 0;
    }
}

module.exports = {
    StateMachine,
};
