if [ -d $1 ] 
then
    export STATIC_HOME=$1
    node server.js
    cd ..
    cd backend-server

    python3 server.py
else
    echo "Sorry, not a directory"
fi