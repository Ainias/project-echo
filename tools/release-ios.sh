#!/usr/bin/env bash

export GOOGLE_MAPS_API_KEY=AIzaSyCVzdiXCm6e-qGVjl_a2-As3Y6z9vyJt_k
export MODE=production
export HOST_URI=https://echoapp.de
#export HOST_URI=http://127.0.0.1:3000
export CONTACT_EMAIL=kontakt@echoapp.de

npm run "cordova ios"
#cordova build ios