const Joi = require("joi");

function buildRulesetSchema(alphabet) {
    const transitionSchema = Joi.object(
        Object.fromEntries(
            alphabet.map(symbol => [symbol, Joi.string().required()])
        )
    ).required().unknown(false);

    return Joi.object().pattern(
        Joi.string(), // state name
        transitionSchema
    );
}

function validateRuleset(ruleset, alphabet) {
    if ( ! ruleset || Object.keys(ruleset).length === 0) {
        throw new Error("Ruleset must not be empty");
    }
    const schema = buildRulesetSchema(alphabet);

    const { error, value } = schema.validate(ruleset);
    if (error) {
        throw new Error(`Invalid ruleset: ${error.message}`);
    }

    // Post-validate transition targets
    const stateNames = new Set(Object.keys(ruleset));

    for (const [state, transitions] of Object.entries(ruleset)) {
        for (const target of Object.values(transitions)) {
            if ( ! stateNames.has(target)) {
                throw new Error(`State "${state}" references unknown target "${target}"`);
            }
        }
    }

    console.info(">> value:", value);
    return value;
}

module.exports = {
    buildRulesetSchema,
    validateRuleset
};
