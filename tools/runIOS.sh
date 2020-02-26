#!/bin/bash

cd ../

git pull
npm install
cordova prepare
npm install

cordova run ios 
mysql.server start
npm run "test ios"
mysql.server stop