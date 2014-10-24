#!/bin/sh

# Make sure we are on master
# git checkout -f master

hugo

# Switch to the gh-pages branch
git checkout -f gh-pages

# Delete all existing files
rm -rf *

# Copy the new files from the temp folder
cp -Rf public/ .
rm -rf public

# Commit the changes
git add -A
git commit -m "Updated site"

# Move back to the master branch
git checkout -f master
git clean -fd