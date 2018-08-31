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

## allNOnCycleCasesForLogsGenerating.json & logsFromAllNonCycleCasesPowerOf2upTo16threads.txt
### conclusions:
Tx reading is allways faster on non cycling state contracts
When using tx reading HashCollector is almost not used.
-> tx_readed 69069 tx_found 395 bin_search 0 node_checked 3612 hash_collector 124
Something bad happend to lastpath.
hashSet: tx_readed 0 tx_found 0 bin_search 0 node_checked 11393 hash_collector 4728
set: tx_readed 0 tx_found 0 bin_search 0 node_checked 11393 hash_collector 4728
lastPath: tx_readed 0 tx_found 0 bin_search 0 node_checked 49760 hash_collector 24


