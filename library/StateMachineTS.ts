export type Alphabet = string[];
export type States<T> = {
    [stateName: string]: {
        [input: string]: string | T;
        result: T;
    };
};

export function verifyInput(pInput: string | number, alphabet: Alphabet): string {
    const input = typeof pInput === "string" ? pInput : pInput.toString();
    if (input.length === 0) {
        throw new Error("Input must not be empty");
    }
    const output = input.split("").map((bit, i) => {
        if (!alphabet.includes(bit)) {
            throw new Error(`Bit "${bit}" at position ${i} is not in alphabet`);
        }
        return bit;
    }).join("");
    return output;
}

export function verifyStates<T>(pStates: States<T>, alphabet: Alphabet): States<T> {
    const states: States<T> = {};
    for (let state in pStates) {
        if (typeof pStates[state] !== "object") {
            throw new Error(`State ${state} must be an object`);
        }

        const stateDef: { [input: string]: string | T } & { result?: T } = {};
        for (let [bit, newState] of Object.entries(pStates[state])) {
            if (bit === "result") {
                stateDef.result = newState as T;
                continue;
            }

            if (!alphabet.includes(bit)) {
                throw new Error(`Bit "${bit}" in state "${state}" is not in alphabet`);
            }

            if (!Object.prototype.hasOwnProperty.call(pStates, newState as string)) {
                throw new Error(`State "${newState}" in state "${state}" is not defined`);
            }

            stateDef[bit] = newState as string;
        }

        if (stateDef.result === undefined) {
            throw new Error(`State "${state}" must have a "result"`);
        }

        states[state] = stateDef as { [input: string]: string | T; result: T };
    }

    return states;
}

export function makeStateMachine<T>(pStates: States<T>, alphabet: Alphabet): (pInput: string | number, pInitialState?: string) => T {
    const states = verifyStates(pStates, alphabet);

    return (pInput: string | number, pInitialState?: string): T => {
        const input = verifyInput(pInput, alphabet);
        let state = pInitialState ?? Object.keys(states)[0];
        for (let bit of input) {
            state = states[state][bit] as string;
        }
        return states[state].result;
    };
}

