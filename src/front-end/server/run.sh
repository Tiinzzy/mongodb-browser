echo 'running server.py'
export STATIC_HOME=/home/tina/Downloads/install1/dist
python3 server.py ponyo &

echo 'running server.js'
export STATIC_HOME=/home/tina/Downloads/install1/dist
node ../server.js ponyo &


echo 'SERVERS ARE READY, WAITING 5 SECONDS TO OPEN THE BROWSER'

sleep 5

sensible-browser http://localhost:3000