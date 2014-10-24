#!/bin/sh

set -e
set -o pipefail

# Make sure we are on master
# git checkout -f master

hugo

# Switch to the gh-pages branch
git checkout gh-pages

# Delete all existing files
git ls-files -z | xargs rm

# Copy the new files from the temp folder
cp -rf public/ .
rm -rf public

# Commit the changes
git add -A
git commit -m "Updated site"

# Move back to the master branch
git checkout master
git clean -fd