#!/bin/bash

echo "collecting stas for badges"

commits=`git rev-list --all --count`
latest_release_tag=$(git describe --tags `git rev-list --tags --max-count=1`)
echo "{\"commits\":\"$commits\", \"release_tag"\:\"$latest_release_tag\"}" > badges.json