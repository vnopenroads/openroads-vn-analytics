#!/usr/bin/env bash

set -eu

main() {
    curl "http://localhost:4000/cba/roads?province=294&limit=2000" | jq . > roads.json
    curl -X POST -H "content-type: application/json" -d@roads.json http://localhost:5000/run_sections > roads.output.json
    jq . roads.html | head -n 20
}

main "$@"
