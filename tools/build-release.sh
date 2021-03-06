#!/usr/bin/env bash

export GOOGLE_MAPS_API_KEY=AIzaSyCVzdiXCm6e-qGVjl_a2-As3Y6z9vyJt_k
export MODE=production
export HOST_URI=https://echoapp.de
export CONTACT_EMAIL=kontakt@echoapp.de
export MATOMO_ID=1

npm run "cordova browser prepare"
rm -rf src/server/public
mv platforms/browser/www src/server/public

echo "copying signing..."
cp tools/signing/echo.jks platforms/android/app/
cp tools/signing/release-signing.properties platforms/android/app/

export ORG_GRADLE_PROJECT_cdvReleaseSigningPropertiesFile=release-signing.properties
npm run "cordova release android"

#cordova build android --release
mv platforms/android/app/build/outputs/apk/release/app-release.apk src/server/public/echo.apk

git add src/server/public/ -v
