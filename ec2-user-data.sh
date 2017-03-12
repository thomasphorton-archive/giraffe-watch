#!/bin/bash
. /opt/bitnami/scripts/setenv.sh
sudo /opt/bitnami/ctlscript.sh stop
git clone https://github.com/thomasphorton/giraffe-watch.git
cd giraffe-watch
npm install
sudo npm install nodemon -g
screen -S giraffe
sudo nodemon app
