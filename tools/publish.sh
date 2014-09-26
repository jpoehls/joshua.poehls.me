#!/bin/sh

# Make sure we are on master
git checkout -f master

TMP=`mktemp -d`

hugo --destination=$(TMP)

# Switch to the gh-pages branch
git checkout -f gh-pages