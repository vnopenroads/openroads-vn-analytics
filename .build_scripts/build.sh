#!/usr/bin/env bash
set -e # halt script on error

# If this is the deploy branch, build it
if [ $TRAVIS_PULL_REQUEST = "false" ] && [ $TRAVIS_BRANCH = ${DEPLOY_BRANCH} ]; then
  echo "Building site"
  gulp build
else
  echo "Not deploying, so long and thanks for all the fish!"
fi
