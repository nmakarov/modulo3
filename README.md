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

### Teting
```
npx jest
```

### Final steps, to be done if needed
-	Write proper documentation
-	Based on the way (ways) how this function will be used
    -	wrap it in a reusable module, etc.
    -	adjust the error handling/reporting (now it throws exceptions)
    -	adjust logging
    -	“verify” functions might sanitize input if possible
    -	Make possible to inject custom “verify” functions




