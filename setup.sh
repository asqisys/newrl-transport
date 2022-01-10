## Setup Node and NPM
curl https://deb.nodesource.com/gpgkey/nodesource.gpg.key | sudo apt-key add -
sudo apt-add-repository "deb https://deb.nodesource.com/node_17.x $(lsb_release -sc) main"
sudo apt-get update
sudo apt-get install nodejs

##Run Project install
npm install

source ./run.sh