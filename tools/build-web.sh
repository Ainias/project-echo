#!/usr/bin/env bash

npm run "cordova browser prepare"
rm -rf server/public
mv platforms/browser/www server/public