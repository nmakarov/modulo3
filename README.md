## The Process
### Step 1
First step is to do a very quick&dirty prototype (spike) – to see how binary strings can be converted to a decimal number, perform a modulo 3 operation and print everything out for a few test values.  
Script: `spikes/take1`  
Benefits: 
-	Verify the solution
-	Visually see how binary numbers will look as decimals (and eyeballing the correct result)

### Step 2
Second step – simple state machine implementation. It takes state defs and a binary string and produces the resulting number.  
Script: `spikes/take2`  
Benefits:
-	See how state machine works
-	Play with params and visualize the future implementation
-	Prep for validation and testing

### Step 3
Now, to the final step – to make it a proper solution.
There's a library module `library/StateMachine.js` that contains all needed functions. There's a script `spikes/take3.js` to verify and play with those functions. And there's a test file `tests/stateMachine.test.js`.  
Benefits:
-   `input` can be a string `"1110"` as well as a number `0b1110` or `14`

#### Step 4
A different solution is to have a StateMachine class (presented in the `library/Statemachine2.js`) that is capable of taking the only param – `RuleSet` and with static methods for "figuring out" all other nesessary params out of it, with an ability to inject custom validators (Joi in this case, as an example). Also it is possible to specify an alphabet as a parameter. There's no spike for this, but tests are presented and have 100% code coverage.

### Considerations
-   It is assumed that `alphabet` should be an array of strings;
-   It is assumed that `states` should be an object of this structure: key of each element is a state name; value is an object of `bit`:`nextState` pairs with an extra pair `result`:`bit` (that is for the Step3 only) that is used to find the correct return value at the end of the state traversing sequence.
-   It is assumed that `input` might be a string containing only allowed bits – or simply an integer (that is internally converted to an array of bits) – that is for step3 only.
-	“verify” functions are sanitizing params and input whenever possible
-   Testing is quite extensive; validators designed in such a way that they stop and throw at the very first error encountered, reporting what exactly is wrong. That can be changed to a way to accumulate all encountered errors and then report them at once, but that adds significant complexity – some validations can't be performed if previous ones failed. For instance it is not possible to test that every entry in the alphabet is a string if alphabet itself is not an array.

### Installing
After cloning the repo, the solution can be initialized this way:
```
npm i
```

### Testing
JavaScript:
```
npx jest
```

### Spikes
All of them lives in the `spikes/` folder. Can be run like so:
```
node spikes/take1.js
node spikes/take2.js
node spikes/take3.js
```

### Final steps, to be done if needed
-	Write proper documentation
-	Based on the way (ways) how this function will be used
    -	wrap it in a reusable module, etc.
    -	adjust the error handling/reporting (now it throws exceptions)
    -	adjust logging
   




