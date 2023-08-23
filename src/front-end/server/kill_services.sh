export TO_BE_KILLED=$(ps aux | grep ponyo | head -n 2 | awk '{print $2}' | paste -s -d " " )
kill $TO_BE_KILLED
export TO_BE_KILLED=

