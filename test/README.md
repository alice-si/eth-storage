Tests shows time of excecution for different getRange function implementations.
Parallel version with parameter n, cuts range for ~n parts and uses getRange n times.
You can set test cases in "test/settings.js" in array getRangeTests.

### test case sample:

    {
        adr: "6badc9463c5cc91cbfb5176ef99a454c3c77b00e",
        idx: stateDB.atStruct(0, 1),
        startBlock: 1110000,
        endBlock: 1113334,
        cb: testLog,
        expectedOutput: '', // unnecessary field
        msg: 'at struct(0,1) search in 3334 blocks'
    },

currently test cases are set to test 3 sample contracts:

    "0x16c8985321696c21d58f3194eee166eedaf37356" have been changed 1000 times in 10000 blocks
    "0xf0764a85241e2ad94a3c75e0a9a17d3ede3865ad" have been changed 100 times in 10000 blocks
    "0x68abe76de1aaaace161bae789a71e54183e1df8b" have been changed 10 times in 10000 blocks

## Folders:
### benchmark
#### generalBenchmark.js:
Script repeats each test case 'numberOfExecutions'
and outputs full, mean, median, max and min time of execution.
currently methods tested in benchmark are set to:

    hashSet with parallelity 8
    set with parallelity 8
    lastPath with parallelity 8
    hashSet with parallelity 100

### samples
Run each test case for various implementations and outputs time of execution and found value.

### contract_creator
geth console input to generate test contracts on testnet

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
