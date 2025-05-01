const verifyInput = (pInput, alphabet) => {
    const input = typeof pInput === "string" ? pInput : pInput.toString();
    if (input.length === 0) {
        throw new Error("Input must not be empty");
    }
    const output = input.split("").map((bit, i) => {
        if ( ! alphabet.includes(bit)) {
            throw new Error(`Bit "${bit}" at position ${i} is not in alphabet`);
        }
        return bit;
    }).join("");
    return output;
};

const verifyStates = (pStates, alphabet) => {
    const states = {};
    for (let state in pStates) {
        if (typeof pStates[state] !== "object") {
            throw new Error(`State ${state} must be an object`);
        }
        states[state] = {};
        let noResultInState = true;
        for (let [ bit, newState ] of Object.entries(pStates[state])) {
            
            if (bit === "result") {
                // here the "result" might be verified as well against something
                // if ( ! alphabet.includes(newState)) {
                //     throw new Error(`Result "${newState}" in state "${state}" is not in alphabet`);
                // }
                states[state].result = newState;
                noResultInState = false;
                continue;
            } else if ( ! alphabet.includes(bit)) {
                throw new Error(`Bit "${bit}" in state "${state}" is not in alphabet`);
            }
            // console.info(">> Object.keys(states):", Object.keys(pStates), ", newState:", newState);
            if ( ! Object.keys(pStates).includes(newState)) {
                throw new Error(`State "${newState}" in state "${state}" is not defined`);
            }
            states[state][bit] = pStates[state][bit];
        }
        // or, just assign an incremented value to the result
        if (noResultInState) {
            throw new Error(`State "${state}" must have a "result"`);
        }
    }
    // now, verify that all states are reachable
    // and that all states have a transition for each input
    // and that there's no loops (???)
    return states;
};

const makeStateMachine = (pStates, alphabet) => {
    const states = verifyStates(pStates, alphabet);

    const transitionFn = (pInput, pInitialState) => {
        // if (typeof pInput !== "string") {
        //     throw new Error("Input must be a string");
        // }
        const input = verifyInput(pInput, alphabet);
        let state = pInitialState ?? Object.keys(states)[0];
        // console.info(`State0: ${state}`);
        for (let bit of input) {
            state = states[state][bit];
            // console.info(`Input: ${bit} -> State: ${state}`);
        }
        // console.info(`Final state: ${state}`);
        return states[state].result;
    };
    return transitionFn;
};

module.exports = {
    verifyInput,
    verifyStates,
    makeStateMachine,
};


