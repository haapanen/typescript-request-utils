#!/bin/bash
# Simple script to publish the library to a local directory
# for testing purposes

if [ -z "$1" ]; then
    echo "Specify output directory"
    exit
fi

npm run prepare
mkdir -p $1
cp -r dist/ $1/
cp package.json $1/
cp yarn.lock $1/