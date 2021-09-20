#!/usr/bin/env bash

set -eu

main() {
    # curl "http://localhost:4000/cba/roads/live?province=294&limit=2000" | jq . > roads.json
    curl "http://localhost:4000/cba/roads/snapshot/1" | \
        jq '. as $assets | {config: {}, assets: $assets }' | jq . > roads_snap.json
    curl -X POST -H "content-type: application/json" -d@roads_snap.json http://localhost:5000/run_sections > roads_snap.output.json
}

main "$@"
