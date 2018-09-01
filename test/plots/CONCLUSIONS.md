## orderInfluence.json
Queries where made for 9 diffrent variables, each repeated 10 times for 3 times.
Results shows 27 candles, each 3 candles shows 3 consecuting test results for same variable.
### conclusion:
Order of tests influences slightly test results. Repeated query is slightly faster.

## 3vars3noncyclecontracts3methods.json
### conclusions:
set is slightly quicker than hashset
last path using one thread is quickest, but diffrence is minimal.
Changes in contract, make queries slower even if queried variable didn`t changed
10 times less changes in contract give 2 times speedup.

## allNonCycleCasesForLogsGenerating.json & logsFromAllNonCycleCasesPowerOf2upTo16threads.txt
### conclusions:
Tx reading is allways faster on non cycling state contracts<br/>
When using tx reading HashCollector is almost not used.<br/>
`tx_readed 69069 tx_found 395 bin_search 0 node_checked 3612 hash_collector 124`<br/>
Something bad happend to lastpath.<br/>
hashSet: `tx_readed 0 tx_found 0 bin_search 0 node_checked 11393 hash_collector 4728`<br/>
set: `tx_readed 0 tx_found 0 bin_search 0 node_checked 11393 hash_collector 4728`<br/>
lastPath: `tx_readed 0 tx_found 0 bin_search 0 node_checked 49760 hash_collector 24`  <br/>


##### lastPath is repaired now

## oneCycleContractsNumberOfExecutions2.json & oneCycleContracts2executionsLogs.txt
### conclusion:
LastPath is repaired now.
When using tx reading lastPath genereates no income
`tx_readed 96624 tx_found 977 bin_search 6 node_checked 7941 hash_collector 0`
Lastpath genereates less short ways<br/>
hashSet: `tx_readed 0 tx_found 0 bin_search 6 node_checked 12655 hash_collector 4795`<br/>
set: `tx_readed 0 tx_found 0 bin_search 6 node_checked 12655 hash_collector 4795`<br/>
lastPath:`tx_readed 0 tx_found 0 bin_search 6 node_checked 23409 hash_collector 3885`<br/>
LastPath is slowest on this cycling contract example.
HashCollector type doesn`t make huge diffrence.

## allCycleContractsNumberOfExecutions10.json & allCycleContracts10executionsLogs.txt
This is result of testing contracts with cycling storage state.
### conclusion:
Hash set is the fastest.
Transaction readings always increases speed.
More threads transaction readings gives more up.
When using transaction reading lastPath gives almost no income.

