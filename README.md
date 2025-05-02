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

### Considerations
-   It is assumed that `alphabet` should be an array of strings;
-   It is assumed that `states` should be an object of this structure: key of each element is a state name; value is an object of `bit`:`nextState` pairs with an extra pair `result`:`bit` that is used to find the correct return value at the end of the state traversing sequence.
-   It is assumed that `input` might be a string containing only allowed bits – or simply an integer (that is internally converted to an array of bits)
-   Testing is quite extensive; validators designed in such a way that they stop and throw at the very first error encountered, reporting what exactly is wrong. That can be changed to a way to accumulate all encountered errors and then report them at once, but that adds significant complexity – some validations can't be performed if previous ones failed. For instance it is not possible to test that every entry in the alphabet is a string if alphabet itself is not an array.

### Installing
After cloning the repo, JS/TS can be initialized this way:
```
npm i
```
Python is usually more tricky, depending on the way/version it is installed (standalone, via Brew, via other pakage manager, etc.) Most of the time setting up a virtual environment and installing the `pytest` into it does the trick like so:
```
python3 -m venv venv
source venv/bin/activate
pip install pytest
```

### Testing
JavaScript:
```
npx jest
```

TypeScript:
```
npx jest -c jest.config.ts.js
```

Python3:
```
pytest
```

### Final steps, to be done if needed
-	Write proper documentation
-	Based on the way (ways) how this function will be used
    -	wrap it in a reusable module, etc.
    -	adjust the error handling/reporting (now it throws exceptions)
    -	adjust logging
    -	“verify” functions might sanitize input if possible
    -	Make possible to inject custom “verify” functions




