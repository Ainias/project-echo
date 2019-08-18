#!/usr/bin/env bash

GOOGLE_MAPS_API_KEY=AIzaSyCVzdiXCm6e-qGVjl_a2-As3Y6z9vyJt_k \
npm run "cordova browser prepare"
rm -rf server/public
mv platforms/browser/www server/public

#npm run "cordova release android"
#mv platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk server/public/echo.apk