if [ -d $1 ] 
then
    echo "Directory $1 exists, so we do not install there!" 
else
    cd /home/tina/Documents/projects/mongodb-browser/src/front-end
    npm run build

    mkdir $1
    cp -a /home/tina/Documents/projects/mongodb-browser/src/front-end/dist $1/

    mkdir $1/dist/backend-server
    cp -a /home/tina/Documents/projects/mongodb-browser/src/back-end/* $1/dist/backend-server

    mkdir $1/dist/frontend-server
    cp -a /home/tina/Documents/projects/mongodb-browser/src/front-end/server/* $1/dist/frontend-server
fi


