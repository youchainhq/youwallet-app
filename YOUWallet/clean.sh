#!/usr/bin/env bash
watchman watch-del-all
rm -rf node_modules && npm install
rm -rf $TMPDIR/react-* && npm start -- --reset-cache
rm -rf $TMPDIR/haste-map-react-native-packager-*