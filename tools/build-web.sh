#!/usr/bin/env bash

npm run "cordova browser prepare"
rm -rf server/public
mv platforms/browser/www server/public

npm run "cordova release android"
mv platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk server/public/echo.apk