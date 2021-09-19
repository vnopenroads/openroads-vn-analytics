#!/usr/bin/env bash

set -eu

main() {
    for i in node-app cba-api react-app; do
        ./1.provision.sh --tags=${i}
    done
}

main "$@"