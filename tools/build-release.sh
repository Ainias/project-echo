#!/usr/bin/env bash

export GOOGLE_MAPS_API_KEY=AIzaSyCVzdiXCm6e-qGVjl_a2-As3Y6z9vyJt_k
export MODE=production
export HOST_URI=https://echoapp.de
#export HOST_URI=http://127.0.0.1:3000
export CONTACT_EMAIL=kontakt@echoapp.de

npm run "cordova browser prepare"
rm -rf src/server/public
mv platforms/browser/www src/server/public

cp tools/signing/echo.jks platforms/android/
cp tools/signing/release-signing.properties platforms/android/

npm run "cordova release android"
mv platforms/android/app/build/outputs/apk/release/app-release.apk src/server/public/echo.apk

git add src/server/public/ -v
