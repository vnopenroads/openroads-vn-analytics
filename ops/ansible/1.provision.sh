#!/usr/bin/env bash
set -eu

main() {
    ansible-playbook -i inventory playbook.yaml --extra-vars "ansible_sudo_pass=${CBA_PASSWORD}" "$@"
}

main "$@"
