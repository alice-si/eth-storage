Tests shows time of excecution for different getRange function implementations.
Parallel version with parameter n, cuts range for ~n parts and uses getRange n times.
You can set test cases in "test/settings.js" in array getRangeTests.

### test case sample:

    {
        adr: "6badc9463c5cc91cbfb5176ef99a454c3c77b00e",
        idx: 0,
        startBlock: 1110000,
        endBlock: 1113334,
        msg: 'sample contract get sample variable named var, when other variables changed each 14 blocks'
    },


## Folders:
### contracts
#### testContracts
.sol, .abi and .bin files of tested contracts
#### contractsHistory.txt
All information about tested contracts (when created, when and how has changed) are in test/contracts/contractsHistory.txt
#### contractsCreatorConsolePaste.js
Functions for creating and changing contracts, paste it in the geth console
#### contractsCreator.js
Library for creating and changing contracts, saving all change and creations to files, in development...
### benchmark
#### generalBenchmark.js:
Script repeats each test case from settings.js 'numberOfExecutions'
and outputs full, mean, median, max and min time of execution.

### plots
You can generate test results here.
plot.html displays data, grouped by test block range length, and sorted by resulted mean time,
gives plot for duration, min, max, mean and median
you can check each candle detailed description by clicking corresponding button.
#### testResult.json format:

    {
      <int>blockRangeLength:[
        {
          executions: <int>executions,
          timerName: <string>timerName,
          params: <{method,threads,txReading}>params,
          results: <{duration,min,max,mean,median}>results,
          testCase: <test case format>testCase
        },
        ...
      ]
    }

How to:

    Use dataToGenerate.js to set test cases
    Use plotDataGenerator.js to save results of test cases in 'results.json'
    Use plot.html and choose file 'results.json' to show charts (need internet connection for cdn links)


### samples
Run each test case from settings.js for various implementations and outputs time of execution and found value.


## Implementation versions:

    Set - uses set to remember visited hashes
    HashSet - uses hashset to remember visited hashes
    LastPath - remembers last visited path in array
    None - checks change in block with no hash checking

    Web3 - requests value from each block independently, using Web3 interface delivered on localhost:8545\

### Sample generalBenchmark.js output:

```json
   Started test case 1, message: "20000 blocks, samplecontract 1 (1000 changes to 10000 blocks) at index 0"

   getRangeMulti8HashSet : test case 1 "20000 blocks, samplecontract 1 (1000 changes to 10000 blocks) at index 0", (iterations 5 searched in 20000 blocks):
   duration 17.350999042 s
   min 3.267818598 s
   max 3.766134807 s
   mean 3.4701998084000003 s
   median 3.353041387 s

   getRangeMulti8LastPath : test case 1 "20000 blocks, samplecontract 1 (1000 changes to 10000 blocks) at index 0", (iterations 5 searched in 20000 blocks):
   duration 16.406131559 s
   min 3.208553585 s
   max 3.478722448 s
   mean 3.2812263118000002 s
   median 3.230700663 s
   ...
```
