#!/usr/bin/env bash

export GOOGLE_MAPS_API_KEY=AIzaSyCVzdiXCm6e-qGVjl_a2-As3Y6z9vyJt_k
export MODE=production
export HOST_URI=https://echo.silas.link/api/v1/

npm run "cordova browser prepare"
rm -rf server/public
mv platforms/browser/www server/public

cp tools/signing/echo.jks platforms/android/
cp tools/signing/release-signing.properties platforms/android/

npm run "cordova release android"
mv platforms/android/app/build/outputs/apk/release/app-release.apk server/public/echo.apk

git add server/public/*
