#!/bin/sh

cd lib/zepto
npm install

# do a custom build for freshman-mobile
MODULES="zepto event ajax form ie detect fx fx_methods callbacks selector touch gesture" npm run-script dist
cp dist/zepto.min.js ../../
