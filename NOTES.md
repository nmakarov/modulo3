## questions

- output is a state itself or a number associated with it?
- if the input is a string of integers, the result is an integer or a string containing a number?
- if it is a number, should it be guessed automatically, figured from the state's digit or be a simply an index of that state?
- is it really necessary pass the `Q` (finite set of states) AND a `delta` (transition function) to the configuration of the FSM? Or it will be just enough to pass the ruleset that defines next state based on the current one and the next digit?
- is this FSM will only operate on a string of integers?
- is it really necessary to pass all those params? Logicaly, the ruleset is the only one needed and other params could be figured out of it
- should 3rd party libraries are to be used (i.e. Joy for validations)?
- is there a need to record a history of transitions?
- is there a need to have debug output (if requested by an option)?

## considerations
- verification of everything could (and should) be done separately; but certain "figureOut" steps require certain structures be present, so they do their own verification; thus majority of things are verified already once the FSM is initialized
- second approach – verify most important aspects of the ResultSet as a first operation, and then individual methods doesn't have to do it
- Lots of things depend on how this solution will be used
    - Is there an extensive ruleset verification is needed or just a basic set of guards so the code won't be broken?
- No Joy, because it is a universal library and error messages are too generic

